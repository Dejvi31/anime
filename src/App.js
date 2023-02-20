import React, { useEffect, useState } from "react";
import './styles.css';
import { AnimeList } from "./Components/AnimeList";
import { AnimeInfo } from "./Components/AnimeInfo";
import { AddToList } from "./Components/AddToList";
import { RemoveFromList } from "./Components/RemoveFromList";
function App() {
  const initialState = JSON.parse(localStorage.getItem("myAnimeList")) || []
  const [search,setSearch]=useState('')
  const [animeData,setAnimeData]=useState();
  const [animeInfo,setAnimeInfo]=useState()
  const [myAnimeList,setMyAnimeList]=useState(initialState)
  const [howMuch,setHowMuch] = useState(12)

  const handleHowMuch = () => {
    setHowMuch(howMuch + 3)
  }

  useEffect(() => {
    localStorage.setItem("myAnimeList", JSON.stringify(myAnimeList))
  },[myAnimeList])

  const addTo=(anime)=>{
    const index=myAnimeList.findIndex((myanime)=>{
        return myanime.mal_id === anime.mal_id
    })
    if(index < 0){
      const newArray=[...myAnimeList,anime]
      setMyAnimeList(newArray);
    }
    
  }
  const removeFrom=(anime)=>{
    const newArray=myAnimeList.filter((myanime)=>{
      return myanime.mal_id !== anime.mal_id
    })
    setMyAnimeList(newArray)
  }
 
  useEffect(()=>{
    const getData=async()=>{
      const res=await fetch(`https://api.jikan.moe/v4/anime?q=${search}&limit=${howMuch}`)
      const resData= await res.json();
      setAnimeData(resData.data)
  }
    getData()
  },[search,howMuch])

  return (
    <>
        <div className="header">
          <h1 onClick={() => setSearch('')} style={{cursor: 'pointer'}}>MyAnimeList</h1>
          <div className="search-box">
              <input type="search" placeholder="Search your anime ..." 
              onChange={(e)=>setSearch(e.target.value)}/>
          </div>
        </div>

        <div className="container">
          <div className="animeInfo">
           {animeInfo && <AnimeInfo animeInfo={animeInfo}/>}
          </div>
          <div className="anime-row">
            <h2 className="text-heading">Anime</h2>
            <div className="row">
                <AnimeList 
                animelist={animeData}
                setAnimeInfo={setAnimeInfo}
                animeComponent={AddToList}
                handleList={(anime)=>addTo(anime)}
                />
            </div>
            <div className="btn">
            <button onClick={handleHowMuch}>Load More</button>
            </div>
            </div>
          
            <div className="MY_LIST">
            <h2 className="TEXT_HEADING">My List</h2>
            <div className="ROW">
                <AnimeList 
                animelist={myAnimeList}
                setAnimeInfo={setAnimeInfo}
                animeComponent={RemoveFromList}
                handleList={(anime)=>removeFrom(anime)}
                />
                </div>
             </div>
             </div>
            
    </>
  );
}

export default App;
