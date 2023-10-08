import React, { FC, useEffect, useState } from 'react';
import styles from './Constructor.module.css';
import ConstructorItem from '../ConstructorItem/ConstructorItem';
import { useAppSelector } from '../../services/hooks/hooks';
import { TComputer } from '../../services/types/types';
import PlaygroundGrid from '../PlaygroundGrid/PlaygroundGrid';

// interface SquareProps {
//     id: number;
//     position: { x: number; y: number };
//     onDragStart: Function;
//     onDragOver: Function;
//     onDrop: Function;
//     occupied: boolean;
//     computer: TComputer | undefined;
// }

// // const Square: React.FC<SquareProps> = ({
// //     id,
// //     position,
// //     onDragStart,
// //     onDragOver,
// //     onDrop,
// // }) => {
// //     const style = {
// //         left: `${position.x}px`,
// //         top: `${position.y}px`,
// //     };

// //     return (
// //         <div
// //             className={styles.square}
// //             draggable
// //             onDragStart={(e) => onDragStart(e, id)}
// //             onDragOver={(e) => onDragOver(e)}
// //             onDrop={(e) => onDrop(e, id)}
// //             style={style}
// //         />
// //     );
// // };
// const Square: React.FC<SquareProps> = ({
//     id,
//     position,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     occupied,
// }) => {
//     const style = {
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//     };

//     // const squareClasses = `${occupied} ? ${styles.square} ${styles.occupied} : ${styles.square}`; // применяем класс styles.occupied в зависимости от занятости
//     const squareClasses = occupied ? styles.square : styles.squareOccupied; // применяем класс styles.occupied в зависимости от занятости

//     return (
//         <div
//             className={squareClasses}
//             draggable
//             onDragStart={(e) => onDragStart(e, id)}
//             onDragOver={(e) => onDragOver(e)}
//             onDrop={(e) => onDrop(e, id)}
//             style={style}
//         />
//     );
// };


// const Grid: FC<{ playground: TComputer[] }> = ({ playground }) => {
//     const gridSize = 200;
//     const squareSize = 18;
//     const [squares, setSquares] = useState<{ id: number; position: { x: number; y: number } }[]>([]);

//     useEffect(() => {
//         const initialSquares = Array.from({ length: gridSize }, (_, index) => {
//             const x = (index % gridSize) * squareSize;
//             const y = Math.floor(index / gridSize) * squareSize;
//             return { id: index, position: { x, y } };
//         });

//         setSquares(initialSquares);
//     }, []);

//     const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
//         console.log("handleDragStart", {
//             e, id
//         });

//         e.dataTransfer.setData("text/plain", id.toString());
//     };

//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();

//         console.log("handleDragOver", {
//             e
//         });
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: number) => {
//         e.preventDefault();
//         const squareId = Number(e.dataTransfer.getData("text/plain"));

//         const updatedSquares = squares.map((square) => {
//             if (square.id === squareId) {
//                 return {
//                     ...square,
//                     position: { x: e.clientX, y: e.clientY },
//                 };
//             }
//             return square;
//         });

//         console.log("handleDrop", {
//             e, id
//         });

//         setSquares(updatedSquares);
//     };

//     // const renderSquares = () => {
//     //     return squares.map((square) => (
//     //         <Square
//     //             key={square.id}
//     //             id={square.id}
//     //             position={square.position}
//     //             onDragStart={handleDragStart}
//     //             onDragOver={handleDragOver}
//     //             onDrop={handleDrop}
//     //         />
//     //     ));
//     // };
//     const renderSquares = () => {
//         return squares.map((square) => {
//             const { id, position } = square;
//             const computer = playground.find((item) => item.id === id);
//             // console.log(computer)
//             return (
//                 <div key={square.id}>
//                     <Square
//                         id={id}
//                         position={position}
//                         onDragStart={handleDragStart}
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                         occupied={true}
//                         computer={computer}
//                     />
//                     {/* {item && (
//                         <ConstructorItem
//                             key={item.id}
//                             index={item.id}
//                             position={position}
//                             computer={playground[0]} />
//                     )} */}
//                 </div>
//             );
//         });
//     };

//     return <div className={styles.grid}>{renderSquares()}</div>;
// };

// const Constructor: FC = () => {
//     const playground = useAppSelector(
//         (store) => store.playground.computers
//     );

//     return (
//         <article className={styles.section}>
//             <Grid playground={playground} />
//             {/* {playground.length > 0 && playground.map((computer: TComputer, index: number) => {
//                 return (
//                     <ConstructorItem computer={computer} index={index + 1} key={index} />
//                 )
//             })} */}
//         </article>
//     );
// }

const Constructor: FC = () => {
    const playground = useAppSelector(
        (store) => store.playground.computers
    );

    return (
        <article className={styles.section}>
            <PlaygroundGrid playground={playground} />
            {/* {playground.length > 0 && playground.map((computer: TComputer, index: number) => {
                return (
                    <ConstructorItem computer={computer} index={index + 1} key={index} />
                )
            })} */}
        </article>
    );
}

export default Constructor;