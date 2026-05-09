import { useEffect, useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

function App() {
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [empresa, setEmpresa] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [precio, setPrecio] = useState("");

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);

        if (currentUser) {
          const ref = collection(
            db,
            "users",
            currentUser.uid,
            "entries"
          );

          onSnapshot(ref, (snapshot) => {
            const data = snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

            setEntries(data);
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const calcularHoras = (inicio, fin) => {
    const start = new Date(
      `2025-01-01T${inicio}`
    );

    const end = new Date(
      `2025-01-01T${fin}`
    );

    return (
      (end - start) / (1000 * 60 * 60)
    );
  };

  const agregarRegistro = async () => {
    if (
      !empresa ||
      !inicio ||
      !fin ||
      !precio
    ) {
      alert("Completa todos los campos");
      return;
    }

    const horas = calcularHoras(
      inicio,
      fin
    );

    const total =
      horas * parseFloat(precio);

    await addDoc(
      collection(
        db,
        "users",
        user.uid,
        "entries"
      ),
      {
        empresa,
        inicio,
        fin,
        precio,
        horas,
        total,
        createdAt: Date.now(),
      }
    );

    setEmpresa("");
    setInicio("");
    setFin("");
    setPrecio("");
  };

  const eliminarRegistro = async (id) => {
    await deleteDoc(
      doc(
        db,
        "users",
        user.uid,
        "entries",
        id
      )
    );
  };

  if (!user) {
    return (
      <div className="login">
        <h1>Control de Horas</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button onClick={login}>
          Iniciar sesión
        </button>

        <button onClick={register}>
          Registrarse
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="topbar">
        <h2>{user.email}</h2>

        <button onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <div className="card">
        <h2>Nuevo Registro</h2>

        <input
          type="text"
          placeholder="Empresa"
          value={empresa}
          onChange={(e) =>
            setEmpresa(e.target.value)
          }
        />

        <input
          type="time"
          value={inicio}
          onChange={(e) =>
            setInicio(e.target.value)
          }
        />

        <input
          type="time"
          value={fin}
          onChange={(e) =>
            setFin(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="€/hora"
          value={precio}
          onChange={(e) =>
            setPrecio(e.target.value)
          }
        />

        <button
          onClick={agregarRegistro}
        >
          Guardar
        </button>
      </div>

      <div className="entries">
        {entries.map((entry) => (
          <div
            className="entry"
            key={entry.id}
          >
            <h3>{entry.empresa}</h3>

            <p>
              {entry.inicio} -{" "}
              {entry.fin}
            </p>

            <p>
              Horas:{" "}
              {Number(
                entry.horas
              ).toFixed(2)}
            </p>

            <p>
              Total: €
              {Number(
                entry.total
              ).toFixed(2)}
            </p>

            <button
              onClick={() =>
                eliminarRegistro(
                  entry.id
                )
              }
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;