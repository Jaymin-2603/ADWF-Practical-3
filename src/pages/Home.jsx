import React from 'react';
import Header from '../components/Header.jsx';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';

export default function Home({ name, themeColor, skillList }) {
  return (
    <>
      <Header name={name} themeColor={themeColor} />
      <About />
      <Skills skillList={skillList} />
    </>
  );
}
