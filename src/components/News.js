import React,{useEffect,useState} from "react";
import NewsItem from "./NewsItem";

import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=> {
 const [articles, setArticles] = useState([])
 const [loading, setLoading] = useState(true)
 const [page, setPage] = useState(1)
 const [totalResults, settotalResults] = useState(0)
 
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  // document.title = `${capitalizeFirstLetter(
  //   props.category
  // )} - NewsDaily`;
  const updateNews = async()=> {
    props.setProgress(50);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    console.log(url)
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(parseData.articles);
    settotalResults(parseData.totalResults);
    setLoading(false);
   
    props.setProgress(100);
  }
  useEffect(() => {
    updateNews();
  
  }, []);
  
  const handlePreClick = async () => {
    console.log("Previous");
   
    setPage(page-1);
    updateNews();
  };
 const  handleNextClick = async () => {
    console.log("Next");
    
    setPage(page+1);
    updateNews();
  };
  const fetchMoreData = async () => {
 
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1);
    let data = await fetch(url);
    let parseData = await data.json();
    setArticles(articles.concat(parseData.articles));
    settotalResults(parseData.totalResults);
   
  };
  
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ margin: "35px 0px",marginTop:"75px"}}>
          {" "}
          DailyNews - Top {capitalizeFirstLetter(props.category)}
          Headlines
        </h1>
<div className="text-center">
        {loading && <Spinner />}
        </div>
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {
                
               articles.map((element) => {
                  return (
                    <div className="col-md-4" key={element.url}>
                      <NewsItem
                        title={element.title ? element.title : ""}
                        description={
                          element.description ? element.description : ""
                        }
                        imageUrl={element.urlToImage}
                        newsUrl={element.url}
                        date={element.publishedAt}
                        author={element.author}
                        source={element.source.name}
                      />
                    </div>
                   
                  );
                })
              }
            </div>
          </div>
        </InfiniteScroll>
        <div className="container d-flex justify-content-between">
          <button
            disabled={page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={handlePreClick}
          >
            {" "}
            &larr; previous
          </button>
          <button
            disabled={
              page + 1 >
              Math.ceil(totalResults / props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  
}
News.defaultProps = {
  country: "uk",
  pageSize: 8,
  category: "general",
};
 News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
export default News;
