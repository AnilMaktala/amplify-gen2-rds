import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

function App() {
  const [persons, setPersons] = useState<Array<Schema["person"]["type"]>>([]);

  useEffect(() => {
    client.models.person.observeQuery().subscribe({
      next: (data) => setPersons([...data.items]),
    });
  }, []);

  function createPerson() {
    client.models.person.create({ firstname: window.prompt("Person name") });
  }
  function searchPerson() {
    client.models.person
      .search(window.prompt("Person name") || undefined)
      .then((data) => setPersons([...data.items]));
  }

  return (
    <main>
      <h1>My People</h1>
      <button onClick={createPerson}>+ new person</button>
      <button onClick={searchPerson}>🔍 search person</button>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.firstname} {person.social}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try adding a new person.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default withAuthenticator(App);
