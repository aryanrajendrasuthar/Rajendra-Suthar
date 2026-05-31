import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Quotes from "./pages/Quotes";
import QuoteDetail from "./pages/QuoteDetail";
import Clients from "./pages/Clients";
import Company from "./pages/Company";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/quotes" replace />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/quotes/:id" element={<QuoteDetail />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/company" element={<Company />} />
                <Route path="*" element={<Navigate to="/quotes" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}