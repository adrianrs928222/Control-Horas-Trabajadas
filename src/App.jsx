import { useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
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

  const [empresa, setEmpresa] = useState("");

  const [inicio, setInicio] = useState("");

  const [fin, setFin] = useState("");

  const [precio, setPrecio] = useState("");

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const ref = collection(
          db,
          "users",
          currentUser.uid,
          "entries"
        );

        onSnapshot(ref, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setEntries(data);
        });
      }
    });

    return () => unsub();
  }, []);

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const calcularHoras = (inicio, fin) => {
    const start = new Date(`2025-01-01T${inicio}`);

    const end = new Date(`2025-01-01T${fin}`);

    return (end - start) / (1000 * 60 * 60);
  };

  const agregarRegistro = async () => {
    if (!empresa || !inicio || !fin || !precio) return;

    const horas = calcularHoras(inicio, fin);

    const total = horas * parseFloat(precio);

    await addDoc(
      collection(db, "users", user.uid, "entries"),
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
      doc(db, "users", user.uid, "entries", id)
    );
  };

  if (!user) {
    return (
      <div className="login">
        <h1>Control de Horas</h1>

        <button onClick={loginGoogle}>
          Iniciar sesión con Google
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <h2>{user.displayName}</h2>

          <p>{user.email}</p>
        </div>

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

        <button onClick={agregarRegistro}>
          Guardar
        </button>
      </div>

      <div className="entries">
        {entries.map((entry) => (
          <div className="entry" key={entry.id}>
            <h3>{entry.empresa}</h3>

            <p>
              {entry.inicio} - {entry.fin}
            </p>

            <p>
              Horas: {entry.horas.toFixed(2)}
            </p>

            <p>
              Total: €
              {entry.total.toFixed(2)}
            </p>

            <button
              onClick={() =>
                eliminarRegistro(entry.id)
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