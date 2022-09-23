import React from 'react'
import Generate from '../assets/nft/generate.svg'
import Choosen from '../assets/nft/choosen.svg'
import Save from '../assets/nft/save.svg'

import Up from '../assets/nft/up.svg'

import Pen from '../assets/pen.svg'

import axios from 'axios'

import { Style } from 'react-style-tag';

export default function NftView({backAddress, folderName, setFolderName, randomStylePresset, setRandomStylePresset, lockColor, colors, traits, setTraits, linkElems} : 
    {backAddress: string; folderName: string; setFolderName: any; randomStylePresset: number; setRandomStylePresset: any; lockColor: boolean, colors: object; traits: Array<any>; setTraits: any; linkElems: any;} ) {

    let [folders, setFolders] = React.useState([])

    React.useEffect(() => {
        axios.get(`${backAddress}get_main_folders`)
        .then((res) => {
            console.log(res.data)
            setFolders(res.data)
            setFolderName(res.data[0])
        })
        .catch((err) => {
            console.log(err)
        })

    }, [])

    let [favorites, setFavorites] = React.useState <Array<any>> ([]),
        [nftNumb, setNftNumb] = React.useState <any>('0001'),
        [nftName, setNftName] = React.useState <string>('nft'),
        [nftNameEdit, setNftNameEdit] = React.useState <boolean>(false)

    React.useEffect(() => {
        console.log(linkElems)
        axios.get(`${backAddress}favorites`)
        .then((res) => {
            console.log('favorites ', res.data)
            setFavorites(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])        
    
    function zeroPad(num: number) {
        return num.toString().padStart(4, "0");
    }        

    function downloadSvg(){
        let svg = document.getElementById("svg") as Node | null,
        serializer = new XMLSerializer(),
        source 
        console.log(serializer)

        if(svg) source = serializer.serializeToString(svg);
        
        //add name spaces.
        if(source&&!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(source&&!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        
        //add xml declaration
        source = '<?xml version="1.0" encoding="utf-8"?>\r\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 1000 1000">\r\n<style type="text/css">#hair {fill: #705ad7;}#nose {fill: #2db3a9;} #nose-D {fill: ;} #nose-L {fill: #7cc4c5;}  #earskin {fill: #f1d0e6;}#texture {fill: #5a2ae7;}#blacks {fill: #523259;}#whites {fill: #ffffff;}#nails {fill: #431f59;}#skin {fill: #856dec;}#skin-D {fill: #705ad7;}#skin-L {fill: #9b7fff;}#skin2 {fill: #c8e7c2;}#skin2-D {fill: #a0d9c2;}#skin2-L {fill: #e8fbe2;}#bone {fill: #523259;}#bone-D {fill: #431f59;}#bone-L {fill: #643c64;}#eye {fill: #dfeee8;}#eye-D {fill: #b5c9c0;}#eye-L {fill: #f1f2f2;}#pupil {fill: #ab281b;}#pupil-D {fill: #6e0500;}#pupil-L {fill: #f2a358;}</style>\r\n' + source+'\r\n</svg>';
        console.log(source)
        //convert svg source to URI data scheme.
        let url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
            let downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = nftName+"_"+nftNumb+".svg";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
        if(!lockColor) setRandomStylePresset(Math.floor(Math.random() * Object.entries(colors).length))    
        setNftNumb(zeroPad(Number(nftNumb) + 1))
    }

    async function generate(){
        let newTrait = [...traits]

        for(let x=0; x<traits.length; x++){
            let traitName = random('random', x,  traits[x].folderName)
            await axios.post(`${backAddress}get_trait`, {
                file: traitName,
                trait: traits[x].folderName,
                folder: folderName
            })
            .then((res) => {
                console.log(res.data)
                console.log(traitName)
                
                if(!traits[x].locked) {
                    newTrait[x].selectedOption = traitName
                    newTrait[x].svg = res.data
                }
            })
        }
        // console.log(newSvgs)
        for(let x=0; x<linkElems.length; x++){
            for(let q=0; q<traits.length; q++){
                if(linkElems[x].folderSecond===traits[q].folderName && linkElems[x].selectSecond===traits[q].selectedOption){
                    console.log('second')
                    await axios.post(`${backAddress}get_trait`, {
                        file: linkElems[x].selectedFirst,
                        trait: linkElems[x].folderFirst,
                        folder: folderName
                    })
                    .then((res) => {
                        console.log(res.data)
                        let index = traits.findIndex(el => el.folderName === linkElems[x].folderFirst);
                        console.log(index)
                        newTrait[index].selectedOption = linkElems[x].selectedFirst
                        newTrait[index].svg = res.data
                    })
                }
            }
        }        
        setTraits(newTrait)
    }

    function random(name: string, indx: number,  folderName: string) {
        if(folderName !== ''){
            for(let x=0; x<linkElems.length; x++){
                for(let q=0; q<traits.length; q++){
                    if(linkElems[x].folderFirst===traits[q].folderName && linkElems[x].selectedFirst===traits[q].selectedOption&&folderName===linkElems[x].folderSecond){
                        console.log('first ', linkElems[x].selectSecond)
                        return linkElems[x].selectSecond
                    }
                }
            }
            let arr = traits[indx].options
            let elem = arr[Math.floor(Math.random() * arr.length)]
            console.log(elem)
            return elem
            // setSelect(indx, elem, folderName)
        }
    }

   async function addToFavorites(){
        if(traits.length){
            let newFavorites = [...favorites]
            if(traits[0]?.svg) newFavorites.unshift({traits: JSON.parse(JSON.stringify(traits)), colorPreset: randomStylePresset})
            console.log(newFavorites)
            setFavorites(newFavorites)
            axios.post(`${backAddress}save_favorites`, {
                favorites: newFavorites
            }).then((res) => {
                // console.log(res)
            }).catch((err) => {
                // console.log(err)
            })
            console.log(randomStylePresset)
            console.log(favorites.length)
        }
    }

    function swapNfts(indx: number){

        let newFavorites = [...favorites]
        if(traits[0]?.svg) newFavorites.push({traits: JSON.parse(JSON.stringify(traits)), colorPreset: randomStylePresset})
        newFavorites = [...newFavorites.filter(el => el !== favorites[indx])]
        
        setTraits(favorites[indx].traits)
        console.log('traits ', favorites[indx].traits)
        setRandomStylePresset(favorites[indx].colorPreset)

        setFavorites(newFavorites)
    }

    React.useEffect(() => {
        if(favorites.length){
            for(let x = 0; x<favorites.length; x++){
                console.log(x)
                let obj = Object.entries(colors)[favorites[x].colorPreset][1]

                Object.entries(obj).map(item => {
                    if(document.querySelector(`#${item[0]}`)){
                        let elem = document.querySelectorAll<any>(`#${item[0]}`)
                        for(let q=0; q<elem.length; q++){
                            let className = elem[q].parentNode?.parentNode?.parentNode as any
                            console.log(className)
                            console.log(`svgOuter${x}`)
                            if(String(className.classList[0]) === `svgOuter${x}` || className.parentNode.classList[0] === `svgOuter${x}` ){
                                elem[q]!.style.fill = item[1]
                            }
                        }
                    }
                })
            }
        }
    }, [favorites])

    function removeElem(index: number){
        let newArr = [...favorites]
        newArr.splice(index, 1);
        setFavorites(newArr)
        console.log('newArr ', newArr)
        axios.post(`${backAddress}save_favorites`, {
            favorites: newArr
        }).then((res) => {
            // console.log(res)
        }).catch((err) => {
            // console.log(err)
        })
    }
    
    let selectedFile = React.useRef <any> (null);

    const handleSubmit = async(event: any) => {
        event.preventDefault()
        let formData = new FormData();
        formData.append("data", selectedFile.current);
        try {
            const file = selectedFile.current;
            const form = new FormData() as any;
            form.append('file', file);

            axios.post(`${backAddress}upload`, form, {
                headers: {'Content-Type': 'multipart/form-data'}
            })        
            .then((res) => {
                console.log('res.data', res.data)
                setFolders(res.data)
                setFolderName(res.data[0])
            })

        } catch(err) {
          console.log(err)
        }
      }

    const handleFileSelect = (event: any) => {
        selectedFile.current = event.target.files[0]
    }

    const  deleteFolder = async (fldrName: string) => {
        if (window.confirm('Are you sure you want to delete this folder from database?')) {
            await axios.post(`${backAddress}deleteFolder`, {
                folderName: fldrName
            }).then((res) => {
                console.log(res.data)
                if(fldrName === folderName){
                    if(res.data[0]) setFolderName(res.data[0])
                    else setFolderName('')
                    setTraits([{folderName: '', options: [], selectedOption: '', svg: null, visible: true, locked: false }])
                }
                setFolders(res.data)
            })
        }           
    }

    function setNewFolder(item: string){
        setFolderName(item)
        setTraits([{folderName: '', options: [], selectedOption: '', svg: null, visible: true, locked: false }])
    }

    function styleButton(e: any){
        e.target.style.transform = 'scale(0.9)'; e.target.style.opacity = '0.8'
    }

    function returnStyleButton(e: any){
        e.target.style.transform = 'scale(1)'; e.target.style.opacity = '1'
    }

    const points = [
        {img: Generate, func: generate},
        {img: Choosen, func: addToFavorites},
        {img: Save, func: downloadSvg}
    ]

    return(
        <div className='nft_preview'>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileSelect}/>
                <input type="submit" value="Upload File" 
                    onMouseDown={e => styleButton(e)} onMouseLeave={e => returnStyleButton(e)} 
                    onMouseUp={e => returnStyleButton(e)} onMouseOut={e => returnStyleButton(e)} />
            </form>            
            <div className="dropdownFolders">
                <button onClick={() => {document.getElementById(`myDropdownFolders`)?.classList.toggle("show")}} className="dropbtn">{folderName === '' ? folders[0] : folderName}</button>
                <div id="myDropdownFolders" className="dropdown-content">
                {folders.map((item, index) => (
                    <span>
                        <div key={index} onClick={() => {document.getElementById(`myDropdownFolders`)?.classList.toggle("show"); setNewFolder(item)}}>{item}</div>
                        <button onClick={() => deleteFolder(item)}>&#10005;</button>
                    </span>
                ))}
                </div>
            </div>
            <span className='nft_name'>
                <img src={Pen} alt="pen" onClick={() => setNftNameEdit(!nftNameEdit) } />
                {nftNameEdit ? <input value={nftName} onChange={e => setNftName(e.target.value)}/>
                : <label>{nftName}{'_'+nftNumb+'.svg'}</label>}
            </span>
            <div className='nft_generated'>
                <svg id="svg" className='svg svgOuter' >
                    {traits.map((el: any, index: number) => (
                        el.visible && <svg key={index} className='' dangerouslySetInnerHTML={{__html: el.svg}}/>
                    ))}
                </svg>    
                <div>
                    {points.map((item, index) => (
                        <img src={item.img} alt="nft" 
                            onMouseDown={e => styleButton(e)}
                            onMouseLeave={e => returnStyleButton(e)} 
                            onMouseUp={e => returnStyleButton(e)}
                            onMouseOut={e => returnStyleButton(e)} 
                            onClick={() => item.func()} />
                    ))}
                </div>
            </div>
            <div className='favorites'>
                {favorites?.map((el, indx) => (
                    <div key={indx}>
                        <svg id="svg" className={'svgOuter'+indx}>
                            {el.traits.map((elem: any, index: number) => (
                                elem.visible && <svg key={index} className='' dangerouslySetInnerHTML={{__html: elem.svg}}/>
                            ))}
                        </svg>  
                        <div className='favorites_side_menu'>
                            <button onClick={() => removeElem(indx)}>&#10005;</button>

                            <img src={Up} alt="nft"                             
                                onMouseDown={e => styleButton(e)}
                                onMouseLeave={e => returnStyleButton(e)} 
                                onMouseUp={e => returnStyleButton(e)}
                                onMouseOut={e => returnStyleButton(e)}
                                onClick={() => swapNfts(indx)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}