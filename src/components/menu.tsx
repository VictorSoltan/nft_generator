import React, { useEffect } from 'react'

import Boots from '../assets/menu/boots.svg'
import Lock from '../assets/menu/lock.svg'
import Up from '../assets/menu/up.svg'
import Dice from '../assets/menu/dice.svg'
import Eye from '../assets/menu/eye.svg'
import Down from '../assets/menu/down.svg'

import Pen from '../assets/pen.svg'

import Plus from '../assets/menu/plus.svg'

import axios from 'axios'

import colors from '../assets/colors.json'
import { unwatchFile } from 'fs'

export default function Menu({setSvgs, svgs, randomStylePresset, traits, setTraits, linkElems, setLinkElems} : 
    {setSvgs: any; svgs: any; randomStylePresset: number; traits: Array<any>, setTraits: any; linkElems: Array<Object>, setLinkElems: any}) {


    React.useEffect(() => {
        let obj = Object.entries(colors)[randomStylePresset][1]
        // console.log(obj)
            
        console.log(document.querySelector(`.svgOuter`)?.classList[1])

        Object.entries(obj).map(item => {
            // console.log(item)
            if(document.querySelector(`#${item[0]}`)){
                let elem = document.querySelectorAll<HTMLElement>(`#${item[0]}`)
                // console.log(elem[0].parentNode?.parentNode?.parentNode)
                // let className = elem[0].parentNode?.parentNode?.parentNode as any
                // console.log(className.classList[2])

                
                for(let x=0; x<elem.length; x++){
                    let className = elem[x].parentNode?.parentNode?.parentNode as any
                    if(className.classList[1] === 'svgOuter' || className.parentNode?.classList[1] === 'svgOuter'){
                        elem[x]!.style.fill = item[1]

                    }
                }
            }
        })
    })

    const menu_points = [
        { img: Boots, name: 'Boots', func: linkElemsFunc }, 
        { img: Lock, name: 'Lock', func: lockSvg }, 
        { img: Up, name: 'Up', func: changeOrder }, 
        { img: Dice, name: 'Dice', func: random }, 
        { img: Eye, name: 'Eye', func: visible }, 
        { img: Down, name: 'Down', func: changeOrder }
    ]

    let [folders, setFolders] = React.useState([]),
    pair = React.useRef<any>({avialiable: false, id: linkElems.length})


    React.useEffect(() => {
        axios.get('http://195.66.114.14:8000/get_folders')
            .then((res) => {
                console.log(res.data)
                let newArr = [...traits]
                for(let x=0; x<newArr.length; x++){
                    newArr[x].options = res.data
                }
                setTraits(newArr)
                setFolders(res.data)
            })
    }, [])

    const addFolder = () => {
        let newArr = [...traits]
        newArr.push({folderName: '', options: folders, selectedOption: '', order: 0, visible: true, locked: false})
        setTraits(newArr)
        // console.log(traits)
    }

    const setSelect = (indx: number, elem: string, name: string) => {
        if(name === '') getTraits(indx, elem) 
        else{
            getTrait(indx, elem)
            let newArr = [...traits]
            newArr[indx].selectedOption = elem
            setTraits(newArr)
        }
    }

    const getTraits = (index: number, e: string) => {
        console.log(e)
        axios.post('http://195.66.114.14:8000/get_traits', {
            trait: e
        })
        .then((res) => {
            console.log(res.data)
            let newArr = [...traits]
            newArr[index].folderName = e
            newArr[index].options = res.data
            newArr[index].order = index
            setTraits(newArr)
        })
    }

    const getTrait = (index: number, e: string) => {
        console.log(e)
        axios.post('http://195.66.114.14:8000/get_trait', {
            file: e,
            trait: traits[index].folderName
        })
        .then((res) => {
            let newArr = [...svgs]
            if(newArr[index]) {
                console.log(newArr[index].svg)
                newArr[index].svg = res.data
            }
            else newArr.push({index: index, svg: res.data, visible: true, locked: false})
            setSvgs(newArr)
        })
    }

    function move(from: number, to: number, arr: Array<Object>) {
        arr.splice(to, 0, arr.splice(from, 1)[0]);
    };

    function changeOrder(name: string, indx: number, folderName: string, selectedOption: string){
        if(selectedOption){
            console.log(indx, indx-1)
            let newArr = [...traits]
            let newSvgs = [...svgs]
            if(name === 'Up'){
                move(indx, indx-1, newArr);
                move(indx, indx-1, newSvgs);
            }else{
                move(indx, indx+1, newArr);
                move(indx, indx+1, newSvgs);
            }
            console.log(newArr)
            setTraits(newArr)
            setSvgs(newSvgs)
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
        let newSvgs = [...svgs]
        let newTraits = [...traits]
        newTraits[indx].visible = !newTraits[indx].visible
        newSvgs[indx].visible = !newSvgs[indx].visible
        setSvgs(newSvgs)
        setTraits(newTraits)
    }

    function lockSvg(name: string, indx: number){
        let newSvgs = [...svgs]
        let newTraits = [...traits]
        newSvgs[indx].locked = !newSvgs[indx].locked
        newTraits[indx].locked = !newTraits[indx].locked
        setSvgs(newSvgs)
        setTraits(newTraits)
    }

    function linkElemsFunc(name: string, indx: number, folderName: string, selectedOption: string){
        let newArr: any = [...linkElems]
        if(selectedOption){
            let continuePairing = true
            for(let x=0; x<newArr.length; x++){
                if(newArr[x].folderFirst === folderName && newArr[x].selectedFirst === selectedOption || newArr[x].folderSecond === folderName && newArr[x].selectSecond === selectedOption){
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
                    console.log(newArr[pair.current.id])
                    newArr[pair.current.id].folderSecond = folderName
                    newArr[pair.current.id].selectSecond = selectedOption
                }
                if(newArr[pair.current.id].selectSecond&&newArr[pair.current.id].selectedFirst){
                    pair.current.id = pair.current.id+1 
                    pair.current.avialiable = false
                }
            }
            console.log(newArr)
            setLinkElems(newArr)
            localStorage.setItem("elemLinks", JSON.stringify(newArr));
        }
    }

    function checkValue(folderName : string, selectedOption: string){
        console.log(folderName, selectedOption)
        let newArr: any = [...linkElems]
        let returnValue = false
        for(let x=0; x<newArr.length; x++){
            if(newArr[x].folderFirst === folderName && newArr[x].selectedFirst === selectedOption || newArr[x].folderSecond === folderName && newArr[x].selectSecond === selectedOption){
                returnValue = true
            }
        }
        return returnValue
    }

    return(
        <div className='generator_menu'>
            {traits.map((el, index) => (
                <span key={index}>
                    <div className='points'>
                        {menu_points.map((item, indx) => (
                           <button key={indx} onClick={() => item.func && item.func(item.name, index, el.folderName, el.selectedOption)}>
                               {
                                item.img === Boots ? <img src={item.img} style={checkValue(el.folderName, el.selectedOption) ? {filter: 'brightness(170%)'} : {filter: 'none'}} alt={item.name} />
                                : <img src={item.img} style={item.img === Lock&&el.locked || item.img === Eye&&!el.visible ? {filter: 'brightness(170%)'} : {filter: 'none'}} alt={item.name} />
                               }
                            </button>    
                        ))}
                    </div>
                    <div className='direction'>
                        <label>
                            <img src={Pen} alt="pen" />
                            {el.folderName}
                        </label>
                        <select id="folder" value={el.selectedOption ? el.selectedOption : ''}>
                            {el.options.map((elem: any, indx: number) => (
                                <option key={indx} value={elem} onClick={() => setSelect(index, elem, el.folderName)}>{elem}</option>
                            ))}
                        </select>
                    </div>
                </span>
            ))}
            <div className='plus_trait'>
                <img src={Plus} alt="add Elem" onClick={(() => addFolder())} />
            </div>
        </div>
    )
}