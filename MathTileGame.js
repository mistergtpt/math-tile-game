const { useState, useEffect } = React;
const { DndProvider, useDrag, useDrop } = ReactDnD;
const { HTML5Backend } = ReactDnDHTML5Backend;
const { TouchBackend } = ReactDnDTouchBackend;
const { useMediaQuery } = window.matchMedia;

const TILE_TYPE = "NUMBER_TILE";

const numberTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const Tile = ({ number }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: TILE_TYPE,
    item: { number },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="tile" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {number}
    </div>
  );
};

const AnswerBox = ({ index, onDrop, answer }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: TILE_TYPE,
    drop: (item) => onDrop(index, item.number),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="answer-box" style={{ backgroundColor: isOver ? "#a2d2ff" : "white" }}>
      {answer !== null ? answer : ""}
    </div>
  );
};

const MathTileGame = () => {
  const isTouchDevice = window.matchMedia("(max-width: 768px)").matches;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;

  const [puzzle, setPuzzle] = useState({
    clues: ["Palindrome perfect square", "Palindrome divisible by 9", "Palindrome prime number"],
    answerSlots: 4,
  });

  const [answers, setAnswers] = useState(Array(puzzle.answerSlots).fill(null));

  const handleDrop = (index, number) => {
    const newAnswers = [...answers];
    newAnswers[index] = number;
    setAnswers(newAnswers);
  };

  return (
    React.createElement(DndProvider, { backend: backend },
      React.createElement("div", { className: "game-container" },
        React.createElement("h2", { className: "game-title" }, "🔎 Number Detective Math Tile Game"),
        React.createElement("div", { className: "clue-container" },
          puzzle.clues.map((clue, idx) =>
            React.createElement("div", { key: idx, className: "clue" }, clue)
          )
        ),
        React.createElement("div", { className: "answer-container" },
          Array.from({ length: puzzle.answerSlots }).map((_, index) =>
            React.createElement(AnswerBox, { key: index, index: index, onDrop: handleDrop, answer: answers[index] })
          )
        ),
        React.createElement("div", { className: "tiles-container" },
          numberTiles.map((num) =>
            React.createElement(Tile, { key: num, number: num })
          )
        )
      )
    )
  );
};

ReactDOM.render(React.createElement(MathTileGame), document.getElementById("root"));
