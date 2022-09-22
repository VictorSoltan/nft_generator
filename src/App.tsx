import React from 'react';
import './App.scss';

import NftView from './components/nft_view'
import Menu from './components/menu'

import colors from './assets/colors.json'

function App() {

  let [folderName, setFolderName] = React.useState(''), 
  [traits, setTraits] = React.useState([
    {folderName: '', options: [], selectedOption: '', svg: null, visible: true, locked: false }
  ]),
  [randomStylePresset, setRandomStylePresset] = React.useState(Math.floor(Math.random() * Object.entries(colors).length)),
  [linkElems, setLinkElems] = React.useState <any> (localStorage.getItem("elemLinks") ? JSON.parse(localStorage.getItem("elemLinks")!) : []),
  [lockColor, setLockColor] = React.useState <boolean> (false);

  React.useEffect(() => {
    console.log(linkElems)
  }, [linkElems])

  window.onclick = function(e: any){
    let allDropdrown = document.querySelectorAll('.show')
    for(let x=0; x<allDropdrown.length; x++){
      if(e.target.nextSibling!==allDropdrown[x]) allDropdrown[x].classList.toggle('show')
    }
  }

  return (
    <div className="App">
      <NftView folderName={folderName} setFolderName={setFolderName} randomStylePresset={randomStylePresset} setRandomStylePresset={setRandomStylePresset} lockColor={lockColor} colors={colors} traits={traits} setTraits={setTraits} linkElems={linkElems} />
      <Menu folderName={folderName} randomStylePresset={randomStylePresset} setRandomStylePresset={setRandomStylePresset} lockColor={lockColor} setLockColor={setLockColor} traits={traits} setTraits={setTraits} linkElems={linkElems} setLinkElems={setLinkElems} />
    </div>
  );
}

export default App;
