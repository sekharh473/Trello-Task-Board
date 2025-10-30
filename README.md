# Collaborative Task Board

## Architecture Decisions
- Used React functional components with Context API for global state.
- BoardContext manages optimistic updates, async syncing, and rollback.

## State Management
- UI updates optimistically (instant user feedback).
- Backend sync simulated with 1s delay and (0.2)20% random failure.
- On failure, the app reverts to the last saved localStorage data.

## Persistence
- Board data stored in localStorage after successful sync.
- On first load, mock data initializes localStorage.

## Performance
- `useCallback`, `useMemo`, and `React.memo` minimize re-renders.
- Optional render counter hook demonstrates render awareness.

## Bonus Features
- LocalStorage persistence 
- Undo/Redo Button
- Simulated backend delay & failure