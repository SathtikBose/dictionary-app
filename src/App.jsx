import { useState } from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

export default function App() {
  const [textColor, setTextColor] = useState("light");
  const [bgColor, setBgColor] = useState("dark");
  const [word, setWord] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function mode() {
    if (document.body.style.backgroundColor === "black") {
      setBgColor("light");
      setTextColor("dark");
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "black";
    } else {
      setBgColor("dark");
      setTextColor("light");
      document.body.style.backgroundColor = "black";
      document.body.style.color = "#fff";
    }
  }

  async function handleSearch() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();
      if (response.ok) {
        setResponse(data);
      } else {
        setError(data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Navbar mode={mode} textColor={textColor} bgColor={bgColor} />
      <Form
        textColor={textColor}
        bgColor={bgColor}
        handleSearch={handleSearch}
        word={word}
        setWord={setWord}
      />
      <Response
        response={response}
        textColor={textColor}
        bgColor={bgColor}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}

function Navbar(props) {
  return (
    <nav
      className={`navbar bg-body-${props.bgColor} d-flex justify-content-between`}
    >
      <div className="container-fluid">
        <a className={`navbar-brand text-${props.textColor}`} href="#">
          <h2>Dictionary App </h2>
        </a>
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => props.mode()}
        >
          <i
            className={`fa-solid fa-${
              props.bgColor === "dark" ? "sun" : "moon"
            }`}
          ></i>
        </button>
      </div>
    </nav>
  );
}

function Form(props) {
  return (
    <div className="container ">
      <div className="input-group mb-3 my-3 d-flex justify-content-evenly">
        <span
          className={`input-group-text text-${props.textColor} bg-${props.bgColor}`}
          id="inputGroup-sizing-default"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input
          type="text"
          className={`form-control text-${props.textColor} bg-${props.bgColor}`}
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
          onChange={(e) => props.setWord(e.target.value)}
          value={props.word}
        />
      </div>
      <div className="container justify-content-center d-flex">
        <button
          type="button"
          className={`btn btn-outline-success  text-${props.textColor} bg-${props.bgColor}`}
          onClick={() => props.handleSearch()}
        >
          Search
        </button>
      </div>
    </div>
  );
}

function Response(props) {
  return (
    <div className="container text-center my-3">
      {props.isLoading ? (
        <Loader />
      ) : props.error ? (
        <div className="alert alert-danger" role="alert">
          {props.error.message || "An error occurred"}
        </div>
      ) : (
        props.response && (
          <Card
            response={props.response}
            textColor={props.textColor}
            bgColor={props.bgColor}
          />
        )
      )}
    </div>
  );
}

function Loader() {
  return (
    <div className="container">
      <PropagateLoader color="green" size={12} speedMultiplier={2} />
    </div>
  );
}

function Card(props) {
  const definition =
    props?.response[0]?.meanings[0]?.definitions[0]?.definition ||
    "No definition found";
  return (
    <div
      className={`card container text-${props.textColor} bg-${props.bgColor}`}
      style={{ width: "18rem" }}
    >
      <div className="card-body">
        <p
          className={`card-text text-center text-${props.textColor} bg-${props.bgColor}`}
        >
          {definition}
        </p>
      </div>
    </div>
  );
}
