function App() {
  return (
    <div
      style={{
        backgroundColor: "#0f172a",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
        gap: "20px",
      }}
    >
      <h1>Control de Horas</h1>

      <input
        type="email"
        placeholder="Email"
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          width: "250px",
        }}
      />

      <input
        type="password"
        placeholder="Contraseña"
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          width: "250px",
        }}
      />

      <button
        style={{
          padding: "12px 20px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#2563eb",
          color: "white",
          cursor: "pointer",
          width: "250px",
        }}
      >
        Iniciar sesión
      </button>
    </div>
  );
}

export default App;