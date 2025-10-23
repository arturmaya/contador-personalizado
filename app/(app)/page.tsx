"use client";

import { useEffect, useState } from "react";

type Contador = {
  id: string;
  nome: string;
  mensagem: string;
  dataInicial: Date;
};

export default function ContadoresPage() {
  const [contadores, setContadores] = useState<Contador[]>([]);

  // 🧩 Carrega contadores do localStorage
  useEffect(() => {
    const salvos = localStorage.getItem("contadoresEndrigo");
    if (salvos) {
      const parsed = JSON.parse(salvos);
      const restaurados = parsed.map((c: any) => ({
        ...c,
        dataInicial: new Date(c.dataInicial),
      }));
      setContadores(restaurados);
    } else {
      // 👶 Um contador inicial
      setContadores([
        {
          id: "endrigo",
          nome: "Endrigo",
          mensagem: "sem calar a boca 😆",
          dataInicial: new Date("2025-10-23"),
        },
      ]);
    }
  }, []);

  // 💾 Salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(
      "contadoresEndrigo",
      JSON.stringify(
        contadores.map((c) => ({
          ...c,
          dataInicial: c.dataInicial.toISOString(),
        }))
      )
    );
  }, [contadores]);

  const calcularDias = (dataInicial: Date) => {
    const hoje = new Date();
    const diff = hoje.getTime() - dataInicial.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const resetarContador = (id: string) => {
    setContadores((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, dataInicial: new Date() } : c
      )
    );
  };

  const adicionarContador = () => {
    const nome = prompt("Nome do contador:");
    if (!nome) return;

    const mensagem = prompt("Mensagem (ex: 'sem calar a boca 😆'):");
    if (!mensagem) return;

    setContadores((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        nome,
        mensagem,
        dataInicial: new Date(),
      },
    ]);
  };

  const editarMensagem = (id: string) => {
    const novaMensagem = prompt("Nova mensagem:");
    if (!novaMensagem) return;
    setContadores((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, mensagem: novaMensagem } : c
      )
    );
  };

  const removerContador = (id: string) => {
    if (confirm("Tem certeza que quer remover este contador?")) {
      setContadores((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#0d1117",
        color: "#e6edf3",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>
        🗓️ Contadores Personalizados
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        {contadores.map((contador) => {
          const dias = calcularDias(contador.dataInicial);
          return (
            <div
              key={contador.id}
              style={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "10px",
                padding: "1.5rem",
                width: "260px",
                textAlign: "center",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                transition: "transform 0.2s ease",
              }}
            >
              <h2 style={{ marginBottom: "0.5rem" }}>{contador.nome}</h2>

              <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                {dias} dia{dias !== 1 ? "s" : ""} {contador.mensagem}
              </p>

              <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>
                Desde {contador.dataInicial.toLocaleDateString("pt-BR")}
              </p>

              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  gap: "0.4rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => resetarContador(contador.id)}
                  style={botaoEstilo("#238636")}
                >
                  🔄 Resetar
                </button>
                <button
                  onClick={() => editarMensagem(contador.id)}
                  style={botaoEstilo("#8957e5")}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => removerContador(contador.id)}
                  style={botaoEstilo("#da3633")}
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={adicionarContador}
        style={{
          ...botaoEstilo("#2f81f7"),
          marginTop: "2rem",
          fontSize: "1rem",
        }}
      >
        ➕ Adicionar contador
      </button>
    </main>
  );
}

function botaoEstilo(cor: string): React.CSSProperties {
  return {
    padding: "0.5rem 1rem",
    backgroundColor: cor,
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };
}
