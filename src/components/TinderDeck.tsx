import { useMemo, useRef, useState } from 'react'
import TinderCard from 'react-tinder-card'

type Person = {
	id: string
	name: string
	age: number
	imageUrl: string
	bio: string
}

type SwipeRecord = {
	personId: string
	personName: string
	direction: 'left' | 'right' | 'up' | 'down'
}

export default function TinderDeck() {
	const people = useMemo<Person[]>(
		() => [
			{
				id: 'p1',
				name: 'Margaret',
				age: 72,
				imageUrl: 'https://images.unsplash.com/photo-1580824456355-1d8fddd174d2?q=80&w=1600&auto=format&fit=crop',
				bio: 'Gardening, baking, and Sunday crossword champion.'
			},
			{
				id: 'p2',
				name: 'Javier',
				age: 68,
				imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop',
				bio: 'Loves chess, long walks, and classic jazz vinyls.'
			},
			{
				id: 'p3',
				name: 'Amina',
				age: 75,
				imageUrl: 'https://images.unsplash.com/photo-1553585139-3f6a673417d2?q=80&w=1600&auto=format&fit=crop',
				bio: 'Community volunteer and avid storyteller.'
			},
			{
				id: 'p4',
				name: 'Robert',
				age: 70,
				imageUrl: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=1600&auto=format&fit=crop',
				bio: 'Retired teacher, photography nerd, and birdwatcher.'
			},
			{
				id: 'p5',
				name: 'Evelyn',
				age: 66,
				imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop',
				bio: 'Board games, knitting, and cooking new recipes.'
			}
		],
		[]
	)

	const [swipes, setSwipes] = useState<SwipeRecord[]>([])
	const [lastDirection, setLastDirection] = useState<SwipeRecord['direction'] | null>(null)
	const [currentIndex, setCurrentIndex] = useState<number>(people.length - 1)
	const cardRefs = useRef<Array<React.RefObject<any>>>(people.map(() => ({ current: null })))

	function onSwipe(direction: SwipeRecord['direction'], person: Person) {
		setLastDirection(direction)
		setSwipes(prev => [...prev, { personId: person.id, personName: person.name, direction }])
		setCurrentIndex(prev => Math.max(-1, prev - 1))
	}

	function onCardLeftScreen(personName: string) {
		// noop for demo; could be used to fetch next batch
	}

	return (
		<div className="deck">
			<div className="cards">
				{people.map((person, index) => (
					<TinderCard
						ref={cardRefs.current[index]}
						className="swipe"
						key={person.id}
						onSwipe={(dir) => onSwipe(dir as SwipeRecord['direction'], person)}
						onCardLeftScreen={() => onCardLeftScreen(person.name)}
						preventSwipe={['up', 'down']}
					>
						<div className="card" style={{ backgroundImage: `url(${person.imageUrl})` }}>
							<div className="card-overlay">
								<div className="card-title">{person.name}, {person.age}</div>
								<div className="card-bio">{person.bio}</div>
							</div>
						</div>
					</TinderCard>
				)).slice(0, currentIndex + 1)}
			</div>

			<div className="feedback">
				<div className={`badge ${lastDirection === 'right' ? 'show like' : ''}`}>Liked</div>
				<div className={`badge ${lastDirection === 'left' ? 'show nope' : ''}`}>Nope</div>
			</div>

			<div className="swipe-log">
				<div className="log-title">Recent swipes</div>
				{swipes.length === 0 && <div className="log-empty">Try swiping a card left or right.</div>}
				<ul>
					{[...swipes].reverse().slice(0, 6).map((s, i) => (
						<li key={`${s.personId}-${i}`}>
							<span className={`pill ${s.direction === 'right' ? 'like' : 'nope'}`}>{s.direction}</span>
							<span className="name">{s.personName}</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}


