import { useState } from "react";
import "./App.css";

function Header(props) {
  return (
    <div>
      <h1>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            props.onChangeMode();
          }}
        >
          {props.title}
        </a>
      </h1>
    </div>
  );
}
function Nav(props) {
  return (
    <div>
      <ol>
        {props.topics.map((p) => {
          return (
            <li key={p.id}>
              <a
                id={p.id}
                href={"/read/" + p.id}
                onClick={(event) => {
                  event.preventDefault();
                  props.onChangeMode(Number(event.target.id));
                }}
              >
                {p.title}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
function Article(props) {
  return (
    <article>
      <h2 style={{ color: props.textcolor }}>{props.title}</h2>
      {props.body}
    </article>
  );
}

function Create(props) {
  return (
    <div>
      <h2>CREATE</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          <input name="title" type="text" placeholder="title" />
        </p>
        <p>
          <textarea name="body" type="text" placeholder="description" />
        </p>
        <p>
          <input type="submit" value="저장하기" />
        </p>
      </form>
    </div>
  );
}
function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <div>
      <h2>UPDATE</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          <input
            name="title"
            type="text"
            placeholder="title"
            value={title}
            onChange={(event) => {
              event.preventDefault();
              setTitle(event.target.value);
            }}
          />
        </p>
        <p>
          <textarea
            name="body"
            type="text"
            placeholder="description"
            value={body}
            onChange={(event) => {
              event.preventDefault();
              setBody(event.target.value);
            }}
          />
        </p>
        <p>
          <input type="submit" value="수정하기" />
        </p>
      </form>
    </div>
  );
}

function App() {
  const [topics, setTopics] = useState([
    { id: 1, title: "HTML", body: "HTML is..." },
    { id: 2, title: "CSS", body: "CSS is..." },
    { id: 3, title: "Javascript", body: "Javascript is..." },
  ]);
  const [nextId, setNextId] = useState(4);

  const [id, setId] = useState(null);
  const [mode, setMode] = useState("Welcome");
  let content = null;
  let contextControl = null;
  if (mode === "Welcome") {
    content = <Article title="Welcome" body="hello, Web!!" />;
  } else if (mode === "Read") {
    let title = null;
    let body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body} />;
    contextControl = (
      <>
        <a
          style={{ marginRight: 15 }}
          href={"/update/" + id}
          onClick={(event) => {
            event.preventDefault();
            setMode("update");
          }}
        >
          수정하기
        </a>
        <input
          type="button"
          value="삭제하기"
          onClick={() => {
            if (window.confirm("정말 삭제하겠습니까?")) {
              if (window.confirm("진짜 삭제하시려고요?")) {
                const newTopics = [];
                for (let i = 0; i < topics.length; i++) {
                  if (id !== topics[i].id) {
                    newTopics.push(topics[i]);
                  }
                }
                setTopics(newTopics);
                setMode("Welcome");
              } else {
                return;
              }
            } else {
              return;
            }
          }}
        />
      </>
    );
  } else if (mode === "create") {
    content = (
      <Create
        onCreate={(_title, _body) => {
          const newTopic = { id: nextId, title: _title, body: _body };
          setTopics([...topics, newTopic]);
          setId(nextId);
          setNextId(nextId + 1);
          setMode("Read");
        }}
      />
    );
  } else if (mode === "update") {
    let title = null;
    let body = null;
    for (let i = 0; i < topics.length; i++) {
      if (topics[i].id === id) {
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = (
      <Update
        title={title}
        body={body}
        onUpdate={(title, body) => {
          const newTopics = [...topics];
          const updatedTopic = { id: id, title: title, body: body };
          for (let i = 0; i < newTopics.length; i++) {
            if (newTopics[i].id === id) {
              newTopics[i] = updatedTopic;
              break;
            }
          }
          setTopics(newTopics);
          setMode("Read");
        }}
      />
    );
  }
  return (
    <div className="App">
      <Header
        title="React!!"
        onChangeMode={() => {
          setMode("Welcome");
        }}
      />
      <Nav
        topics={topics}
        onChangeMode={(_id) => {
          setMode("Read");
          setId(_id);
        }}
      />
      {content}
      <a
        style={{ marginRight: 15 }}
        href="/create"
        onClick={(event) => {
          event.preventDefault();
          setMode("create");
        }}
      >
        추가하기
      </a>
      {contextControl}
    </div>
  );
}

export default App;
