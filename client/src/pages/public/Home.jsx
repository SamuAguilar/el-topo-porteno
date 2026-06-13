// src/pages/public/Home.jsx
import Hero from "../../components/settings/Hero";
import Features from "../../components/settings/Features";
import FAQ from "../../components/settings/FAQ";
import Form from "../../components/settings/Form";
import Chatbot from "../../components/settings/Chatbot"; 

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FAQ />
      <Form />
      <Chatbot /> 
    </>
  );
}