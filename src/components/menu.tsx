import React from 'react'

import Boots from '../assets/menu/boots.svg'
import Lock from '../assets/menu/lock.svg'
import Up from '../assets/menu/up.svg'
import Dice from '../assets/menu/dice.svg'
import Eye from '../assets/menu/eye.svg'
import Down from '../assets/menu/down.svg'

import Pen from '../assets/pen.svg'

import Plus from '../assets/menu/plus.svg'

import axios from 'axios'

export default function Menu({backAddress, folderName, randomStylePresset, setRandomStylePresset, lockColor, setLockColor, colors, setColors, traits, setTraits, linkElems, setLinkElems} : 
    {backAddress: string; folderName: any; randomStylePresset: number; setRandomStylePresset: any; lockColor: boolean; setLockColor: any; colors: any; setColors: any; traits: Array<any>, setTraits: any; linkElems: Array<Object>, setLinkElems: any}) {


    React.useEffect(() => {
        if(colors){
            try{
                let obj = Object.entries(colors)[randomStylePresset][1] as any

                Object.entries(obj).map(item => {
                    if(document.querySelector(`#${item[0]}`)){
                        let elem = document.querySelectorAll<any>(`#${item[0]}`)
                        
                        for(let x=0; x<elem.length; x++){
                            let className = elem[x].parentNode?.parentNode?.parentNode as any
                            if(className.classList[1] === 'svgOuter' || className.parentNode?.classList[1] === 'svgOuter'){
                                elem[x]!.style.fill = item[1]
                            
                            }
                        }
                    }
          
                })
            }catch(e){
                console.log(e)
            }      
        }

        let leftEyes = document.querySelectorAll('#filler-eyes-l')
        for(let x = 0; x<leftEyes.length; x++){
            leftEyes[x].setAttributeNS(null, 'clip-path', 'url(#lpath_1_)');
        }
        let rightEyes = document.querySelectorAll('#filler-eyes-r')
        for(let x = 0; x<rightEyes.length; x++){
            rightEyes[x].setAttributeNS(null, 'clip-path', 'url(#rpath_1_)');
        }
    })

    const menu_points = [
        { img: Boots, name: 'Boots', func: linkElemsFunc }, 
        { img: Lock, name: 'Lock', func: lockSvg }, 
        { img: Up, name: 'Up', func: changeOrder }, 
        { img: Dice, name: 'Dice', func: random }, 
        { img: Eye, name: 'Eye', func: visible }, 
        { img: Down, name: 'Down', func: changeOrder }
    ]

    const color_menu_points = [
        { img: Lock, name: 'Lock', func: lockColorFunc }, 
        { img: Dice, name: 'Dice', func: randomColor }, 
    ]

    let [folders, setFolders] = React.useState([]),
    pair = React.useRef<any>({avialiable: false})

    React.useEffect(() => {
        if(folderName!==''){
            axios.post(`${backAddress}get_folders`, {
                folder: folderName
            })
            .then((res) => {
                console.log(res.data)
                // let newArr = [...traits]
                // for(let x=0; x<newArr.length; x++){
                //     newArr[x].options = res.data
                // }
                console.log('res.data ', res.data)
                setFolders(res.data)
                // setTraits(newArr)
            })
        }
        if(folderName!==''){
            axios.post(`${backAddress}get_colors`, {
                folder: folderName
            })
            .then((res) => {
                console.log(res.data)
                console.log('res.data ', res.data)
                setColors(res.data)
                setRandomStylePresset([res.data].length ? Math.floor(Math.random() * Object.entries(res.data).length) : 0)
            })
        }
    }, [backAddress, folderName])

    const addFolder = () => {
        let newArr = [...traits]
        newArr.push({folderName: '', options: folders, selectedOption: '', visible: true, locked: false})
        setTraits(newArr)
        // console.log(traits)
    }

    const setSelect = (index: number, elem: string, name: string) => {
        if(name === '') getTraits(index, elem) 
        else{
            getTrait(index, elem)
            let newArr = [...traits]
            newArr[index].selectedOption = elem
            setTraits(newArr)
        }
    }

    const getTraits = (index: number, e: string) => {
        console.log(`${backAddress}get_traits`)
        if(folderName!==''){
            axios.post(`${backAddress}get_traits`, {
                trait: e,
                folder: folderName
            })
            .then((res) => {
                console.log(res.data)
                let newArr = [...traits]
                newArr[index].folderName = e
                newArr[index].options = res.data
                setTraits(newArr)
            })
        }
    }

    const getTrait = (index: number, e: string) => {
        console.log(e)
        if(folderName!==''){
            axios.post(`${backAddress}get_trait`, {
                file: e,
                trait: traits[index].folderName,
                folder: folderName
            })
            .then((res) => {
                let newArr = [...traits]
                if(newArr[index]) {
                    console.log(newArr[index].svg)
                    newArr[index].svg = res.data
                }
                else newArr.push({folderName: '', options: [], selectedOption: '', svg: res.data, visible: true, locked: false})
                setTraits(newArr)
            })
            .catch((err) => {
                if(e&&traits[index].folderName) alert(`No such trait as ${e}, in ${traits[index].folderName}`)
                return
            })
        }
    }

    function move(from: number, to: number, arr: Array<Object>) {
        arr.splice(to, 0, arr.splice(from, 1)[0]);
    };

    function changeOrder(name: string, indx: number, folderName: string, selectedOption: string){
        if(selectedOption){
            console.log(indx, indx-1)
            let newArr = [...traits]
            if(name === 'Up'){
                move(indx, indx-1, newArr);
            }else{
                move(indx, indx+1, newArr);
            }
            console.log(newArr)
            setTraits(newArr)
        }
    }

    function random(name: string, indx: number,  folderName: string) {
        if(folderName !== ''){
            let arr = traits[indx].options
            let elem = arr[Math.floor(Math.random() * arr.length)]
            console.log(elem)
            setSelect(indx, elem, folderName)

        }
    }

    function visible(name: string, indx: number){
        let newTraits = [...traits]
        newTraits[indx].visible = !newTraits[indx].visible
        setTraits(newTraits)
    }

    function lockSvg(name: string, indx: number){
        let newTraits = [...traits]
        newTraits[indx].locked = !newTraits[indx].locked
        setTraits(newTraits)
    }

    function linkElemsFunc(name: string, indx: number, folderName: string, selectedOption: string){
        let newArr: any = [...linkElems]
        if(selectedOption){
            let continuePairing = true
            for(let x=0; x<newArr.length; x++){
                if((newArr[x].folderFirst === folderName && newArr[x].selectedFirst === selectedOption) || (newArr[x].folderSecond === folderName && newArr[x].selectSecond === selectedOption)){
                    newArr.splice(x, x+1); 
                    console.log(x)
                    continuePairing = false
                }
            }
            if(continuePairing){
                if(!pair.current.avialiable){
                    console.log(folderName, selectedOption)
                    newArr.push({folderFirst: folderName, selectedFirst: selectedOption, folderSecond: undefined, selectSecond: undefined})
                    pair.current.avialiable = true
                }else{
                    console.log(newArr.length)
                    console.log(newArr[newArr.length-1])
                    newArr[newArr.length-1].folderSecond = folderName
                    newArr[newArr.length-1].selectSecond = selectedOption
                }
                if(newArr[newArr.length-1]?.selectSecond&&newArr[newArr.length-1]?.selectedFirst){
                    pair.current.avialiable = false
                }
            }
            console.log(newArr)
            setLinkElems(newArr)
            axios.post(`${backAddress}save_elemLinks`, {
                elemLinks: newArr
            }).then((res) => {
                // console.log(res)
            }).catch((err) => {
                // console.log(err)
            })
        }
    }

    function checkValue(folderName : string, selectedOption: string){
        console.log(folderName, selectedOption)
        let newArr: any = [...linkElems]
        let returnValue = false
        for(let x=0; x<newArr.length; x++){
            if((newArr[x].folderFirst === folderName && newArr[x].selectedFirst === selectedOption) || (newArr[x].folderSecond === folderName && newArr[x].selectSecond === selectedOption)){
                returnValue = true
            }
        }
        return returnValue
    }

    function myFunction(index: number) {
        document.getElementById(`myDropdown${index}`)?.classList.toggle("show");
    }

    function removeElem(index: number){
        let newArr = [...traits]
        newArr.splice(index, 1);
        setTraits(newArr)
    }

    function lockColorFunc(){
        setLockColor(!lockColor)
    }

    function randomColor(){
        setRandomStylePresset(Math.floor(Math.random() * Object.entries(colors).length))
    }

    function styleButton(e: any){
        e.target.style.transform = 'scale(0.9)'; e.target.style.opacity = '0.8'
    }

    function returnStyleButton(e: any){
        e.target.style.transform = 'scale(1)'; e.target.style.opacity = '1'
    }
    return(
        <div className='generator_menu'>
            <span>
                <div className='points'>
                    {color_menu_points.map((item, indx) => (
                        <button
                            onMouseDown={e => styleButton(e)}
                            onMouseLeave={e => returnStyleButton(e)} 
                            onMouseUp={e => returnStyleButton(e)}
                            onMouseOut={e => returnStyleButton(e)} 
                            key={indx} onClick={() => item.func()}>
                            <img src={item.img} style={item.img === Lock&&lockColor ? {filter: 'brightness(170%)'} : {filter: 'none'}} alt={item.name} />
                        </button>    
                    ))}
                </div>
                <div className='direction'>
                    <div className="dropdown">
                        <button onClick={() => myFunction(9999)} className="dropbtn">{colors&&Object.entries(colors)[randomStylePresset] ? Object.entries(colors)[randomStylePresset][0]  : ''}</button>
                        <div id="myDropdown9999" className="dropdown-content">
                        {colors && Object.entries(colors).map((item, index) => (
                            <span key={index} onClick={() => {setRandomStylePresset(index); myFunction(9999)}}>
                                {item[0]}
                            </span>
                        ))}
                        </div>
  
                    </div>
                </div>
            </span>            
            {traits.map((el, index) => (
                <span key={index}>
                    <div className='points'>
                        {menu_points.map((item, indx) => (
                           <button                             
                            onMouseDown={e => styleButton(e)}
                            onMouseLeave={e => returnStyleButton(e)} 
                            onMouseUp={e => returnStyleButton(e)} 
                            onMouseOut={e => returnStyleButton(e)} 
                            key={indx} onClick={() => item.func && item.func(item.name, index, el.folderName, el.selectedOption)}>
                               {
                                item.img === Boots ? <img src={item.img} style={checkValue(el.folderName, el.selectedOption) ? {filter: 'brightness(170%)'} : {filter: 'none'}} alt={item.name} />
                                : <img src={item.img} style={(item.img === Lock&&el.locked) || (item.img === Eye&&el.visible) ? {filter: 'brightness(170%)'} : {filter: 'none'}} alt={item.name} />
                               }
                            </button>    
                        ))}
                    </div>
                    <div className='direction'>
                        <header>
                            <label>
                                <img src={Pen} alt="pen" />
                                {el.folderName}
                            </label>
                            <button onClick={() => removeElem(index)}>&#10005;</button>
                        </header>
                        <div className="dropdown">
                            <button onClick={() => myFunction(index)} className="dropbtn">{el.selectedOption ? el.selectedOption : 'Choose a trait'}</button>
                            <div id={"myDropdown"+index} className="dropdown-content">
                                {(el.options.length ? el.options : folders).map((elem: any, indx: number) => (
                                    <span key={indx} onClick={() => setSelect(index, elem, el.folderName)}>
                                        {elem}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </span>
            ))}
            <div className='plus_trait'>
                <img src={Plus} alt="add Elem"                             
                    onMouseDown={e => styleButton(e)}
                    onMouseLeave={e => returnStyleButton(e)} 
                    onMouseUp={e => returnStyleButton(e)}
                    onMouseOut={e => returnStyleButton(e)} onClick={(() => addFolder())} />
            </div>
        </div>
    )
}