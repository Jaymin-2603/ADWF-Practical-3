# AWDF Practical 3 — GitHub API Portfolio

The Practical 2 portfolio extended with a live GitHub REST API list on the Projects page. The five selected project cards remain alongside the API results.

## Run locally

Requires Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). For a production build and local preview:

```bash
npm run build
npm run preview
```

Run the component tests with `npm test`.

## Routes and component architecture

| Path | Component | Content |
| --- | --- | --- |
| `/` | `Home.jsx` | Header, About, and prop-driven Skills |
| `/projects` | `Projects.jsx` | Five featured cards plus live public repositories from GitHub |
| `/contact` | `Contact.jsx` | Controlled contact form with live preview and character count |
| Any other path | `NotFound.jsx` | Custom 404 page with a route back home |

```text
main.jsx          — BrowserRouter wraps App once
App.jsx           — route table, theme state, shared NavBar and Footer
├── Home.jsx      — Header, About, and Skills
├── Projects.jsx  — featured cards, fetch state, search, and live repository list
│   └── lib/githubRepos.js — API request, response validation, and name filtering
├── Contact.jsx   — controlled inputs and toggleable help
└── NotFound.jsx  — unknown-path fallback
```

`App.jsx` owns the student data and passes it to children. Change `student.name`, `student.themeColor`, or the `student.skills` array in `src/App.jsx` to see the UI update. `Skills` renders its list from the prop, so adding a skill needs no new JSX. `NavBar` uses `NavLink` so the active route is identified without a full page reload.

## State and interaction

- `App` uses `useState` to toggle the `theme-dark` class on the root layout. The choice remains active while navigating between routes.
- `Contact` uses `useState` for the visitor name and message. The controlled fields update a live preview, and the message shows a live `0 / 280` character count.
- Another `useState` value shows or hides writing tips.
- The contact action opens the visitor's email app with the message filled in. This portfolio has no backend and does not store or send messages itself.

## GitHub API integration

The Projects page requests `https://api.github.com/users/Jaymin-2603/repos?per_page=100&sort=updated` when it mounts. No token or environment variable is required. The API only returns public repositories owned by this account; private repositories and team repositories are still represented by the five featured cards.

`useEffect` starts the request after the component renders. Calling `fetch` in the component body would issue another request after every state update. An `AbortController` cancels the request if the page unmounts. Separate `repos`, `loading`, and `error` state values keep the spinner, failure message, and repository list distinct. The error view offers **Try again**. The search input filters loaded repository names without another API request, and each result displays its name, GitHub URL, and star count.

If GitHub is unavailable or limits anonymous requests, the featured cards stay visible and the live section shows an error with a retry button. Run `npm test` for component and API behavior tests. To test the network failure in a browser, block `api.github.com` in DevTools and reload `/projects`, then unblock it and use **Try again**.

## Concepts and reflection

- **Why components?** Each component owns one section of the page. It is easier to read, change, and reuse than a single large JSX file. It also avoids repeating the same list markup for every skill or project.
- **How do props update the UI?** React passes data from `App` into child components. When a parent renders with different props, React renders the affected child again and updates the DOM where its output changed.
- **Why this matters at scale:** Shared components keep structure and behavior consistent across a larger app while allowing content to vary through props.
- **Why routes?** Home, Projects, and Contact have distinct URLs and components. React Router updates browser history and the displayed component without loading a new HTML document.
- **Why state?** Props supply parent data; state tracks values changed by interaction. A state update causes React to render the affected UI again.
- **Errors encountered:** The starting repository was empty, so this project was created from scratch. An initial component test exposed `React is not defined` because JSX used the classic React runtime; importing React in each JSX file resolved it. A browser check also found a missing favicon request, which was fixed by adding a local SVG icon. Mobile testing exposed an incorrect active navigation item at the bottom of the page; a scroll-position check now handles that boundary. The skills section includes an empty-list state.
- **Practical 2 reflection:** The copied folder had no Git metadata, so this version is published as its own `ADWF-Practical-2` repository. The old section-anchor navigation was replaced with route links, and the new form uses `mailto:` because the practical has no contact API.
- **Practical 3 reflection:** The new live list has separate loading and error states so a slow or failed request is visible instead of showing an empty list. A successful HTTP response is also validated before rendering because an unexpected API shape would otherwise break the map operation. The retry button starts a new request, and unmounting cancels an in-flight request.

The project cards link to the five repositories supplied for this portfolio. TNP-CELL and AquaSenti are private GitHub repositories, so their cards carry an access note. Their descriptions were checked against the local codebases, and authenticated Git access confirms both remotes exist.
