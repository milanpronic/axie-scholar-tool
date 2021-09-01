import banners from '../img/banner/banner.jpg';

const Banner = () => {
    return (
        <div className="d-flex" style={{backgroundImage: `url(${banners})`, backgroundSize: 'cover', minHeight: '300px'}}>
            <div className="container-fluid">
                <p className="mt-5 text-white">UPDATE</p>
                <div className="row justify-content-center text-white">
                    {/* <div className="col-md-10 row justify-content-between"> */}
                        <div className="col-md-2">
                            <p className="m-0 h3">32,560 USD</p>
                            <p className="m-0 h6">2,560SLP</p>
                            <p className="m-0 h3">TODAY</p>
                        </div>
                        <div className="col-md-2">
                            <p className="m-0 h3">32,560 USD</p>
                            <p className="m-0 h6">2,560SLP</p>
                            <p className="m-0 h3">TODAY</p>
                        </div>
                        <div className="col-md-2">
                            <p className="m-0 h3">32,560 USD</p>
                            <p className="m-0 h6">2,560SLP</p>
                            <p className="m-0 h3">TODAY</p>
                        </div>
                        <div className="col-md-2">
                            <p className="m-0 h3">32,560 USD</p>
                            <p className="m-0 h6">2,560SLP</p>
                            <p className="m-0 h3">TODAY</p>
                        </div>
                        <div className="col-md-2">
                            <p className="m-0 h3">32,560 USD</p>
                            <p className="m-0 h6">2,560SLP</p>
                            <p className="m-0 h3">TODAY</p>
                        </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
    )
}

export default Banner;