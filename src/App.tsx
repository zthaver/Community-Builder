import TinderDeck from './components/TinderDeck'

export default function App() {
	return (
		<div className="app">
			<header className="header">
				<div className="brand">Elderly App</div>
				<div className="subtitle">React Tinder Cards (TypeScript)</div>
			</header>

			<main className="main">
				<TinderDeck />
			</main>

			<footer className="footer">
				<a href="https://github.com/3DJakob/react-tinder-card" target="_blank" rel="noreferrer">react-tinder-card</a>
				<span> • </span>
				<a href="https://vitejs.dev/" target="_blank" rel="noreferrer">Vite</a>
			</footer>
		</div>
	)
}


