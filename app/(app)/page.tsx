"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type Contador = {
  id: string;
  nome: string;
  mensagem: string;
  dataInicial: Date;
};

export default function ContadoresPage() {
  const [contadores, setContadores] = useState<Contador[]>([]);

  useEffect(() => {
    const ref = collection(db, "contadoresEndrigo");
    const unsub = onSnapshot(ref, (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome,
        mensagem: doc.data().mensagem,
        dataInicial: doc.data().dataInicial?.toDate?.() ?? new Date(),
      }));
      setContadores(dados);
    });

    return () => unsub();
  }, []);

  const calcularDias = (dataInicial: Date) => {
    const diff = new Date().getTime() - dataInicial.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const adicionarContador = async () => {
    const nome = prompt("Nome do contador:");
    if (!nome) return;

    const mensagem = prompt("Mensagem (ex: 'sem calar a boca 😆'):");
    if (!mensagem) return;

    await addDoc(collection(db, "contadoresEndrigo"), {
      nome,
      mensagem,
      dataInicial: new Date(),
      criadoEm: serverTimestamp(),
    });
  };

  const editarMensagem = async (id: string) => {
    const novaMensagem = prompt("Nova mensagem:");
    if (!novaMensagem) return;

    await updateDoc(doc(db, "contadoresEndrigo", id), {
      mensagem: novaMensagem,
    });
  };

  const resetarContador = async (id: string) => {
    await updateDoc(doc(db, "contadoresEndrigo", id), {
      dataInicial: new Date(),
    });
  };

  const removerContador = async (id: string) => {
    if (confirm("Tem certeza que quer remover este contador?")) {
      await deleteDoc(doc(db, "contadoresEndrigo", id));
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
        🗓️ Contadores Permanentes (Firebase)
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
        {contadores.map((c) => {
          const dias = calcularDias(c.dataInicial);
          return (
            <div
              key={c.id}
              style={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "10px",
                padding: "1.5rem",
                width: "260px",
                textAlign: "center",
              }}
            >
              <h2>{c.nome}</h2>
              <p style={{ fontSize: "1.1rem" }}>
                {dias} dia{dias !== 1 ? "s" : ""} {c.mensagem}
              </p>
              <p style={{ opacity: 0.7 }}>
                Desde {c.dataInicial.toLocaleDateString("pt-BR")}
              </p>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  gap: "0.4rem",
                  justifyContent: "center",
                }}
              >
                <button onClick={() => resetarContador(c.id)}>🔄 Resetar</button>
                <button onClick={() => editarMensagem(c.id)}>✏️ Editar</button>
                <button onClick={() => removerContador(c.id)}>🗑️ Remover</button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={adicionarContador}
        style={{
          marginTop: "2rem",
          backgroundColor: "#2f81f7",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "0.6rem 1.2rem",
          cursor: "pointer",
        }}
      >
        ➕ Adicionar contador
      </button>
    </main>
  );
}
