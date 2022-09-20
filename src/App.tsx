import React from 'react';
import './App.scss';

import NftView from './components/nft_view'
import Menu from './components/menu'

import colors from './assets/colors.json'

function App() {

  let [svgs, setSvgs] = React.useState([]),
  [traits, setTraits] = React.useState([
    {folderName: '', options: [], selectedOption: '', order: 0, visible: true, locked: false }
  ]),
  [randomStylePresset, setRandomStylePresset] = React.useState(Math.floor(Math.random() * Object.entries(colors).length)),
  [linkElems, setLinkElems] = React.useState <any> (localStorage.getItem("elemLinks") ? JSON.parse(localStorage.getItem("elemLinks")!) : [])

  React.useEffect(() => {
    console.log(linkElems)
  }, [linkElems])

  return (
    <div className="App">
      <NftView svgs={svgs} setSvgs={setSvgs} randomStylePresset={randomStylePresset} setRandomStylePresset={setRandomStylePresset} colors={colors} traits={traits} setTraits={setTraits} linkElems={linkElems} />
      <Menu setSvgs={setSvgs} svgs={svgs} randomStylePresset={randomStylePresset} traits={traits} setTraits={setTraits} linkElems={linkElems} setLinkElems={setLinkElems} />
    </div>
  );
}

export default App;
