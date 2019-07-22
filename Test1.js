class DeparmentHomeCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentCarouselImages: []
        }
    }
    componentDidMount() {
        var errorMessage = '';
        var appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
        appweburl = appweburl.substring(0, appweburl.lastIndexOf('/'));
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = yyyy + '-' + mm + '-' + dd;
        today = today + 'T00%3a00%3a00';
        var departmentquery = "'?$select=File,ImageDescription,ID,ImgUrl,ContentType0,ImageTitle,NavigateURLType,StartDate,ExpiryDate&$filter=((datetime'" + today + "' ge StartDate)and( datetime'" + today + "' le ExpiryDate)) and (IsActive eq 1)&$orderby=Modified desc &$expand=File'";
        var getUrl = appweburl + "/_api/web/lists/GetByTitle('" + constants.departmentCarouselListName + "')/items" + departmentquery;
        var departmentNameUrl = appweburl + "/_api/web/title"
        getServiceCall(getUrl).then(data => {
            this.setState({
                departmentCarouselImages: data.d.results
            })
            sliderScript();
        },error => {
           errorMessage = error.responseJSON.error.message;
            DepartmentLogerror('DeparmentHomeCarousel', 'CarouselImages', 'getServiceCall-OnpageLoad', errorMessage)
        })
        getServiceCall(departmentNameUrl).then(data => {
            document.getElementById('departmentTile').innerHTML =data.d.Title;

        },error => {
            errorMessage = error.responseJSON.error.message;
            DepartmentLogerror('DeparmentHomeCarousel', 'DepartmentName', 'getServiceCall-OnpageLoad', errorMessage)
        })
    }
    imageRedirect = (imgUrl, RedirectionType, ID) => {
        event.preventDefault();
        if (RedirectionType == 'External') {
            window.open(imgUrl, '_blank');
        }
        if (RedirectionType == 'Internal') {
            window.open(DepReadMoreUrl + ID, '_parent');
        }
    }
    render() {
        return (
            <div className="demo">
                <ul id="lightSlider" className="light">
                    { this.state.departmentCarouselImages.map((individualbannerimage) =>
                        <li key={individualbannerimage.ID} data-src={individualbannerimage.ContentType0} data-thumb={individualbannerimage.ContentType0 == 'Image' ? individualbannerimage.File.ServerRelativeUrl : (individualbannerimage.ContentType0 == 'Video' ? individualbannerimage.File.ServerRelativeUrl : (individualbannerimage.ContentType0 == 'Text' ? individualbannerimage.ImageTitle : null))}>
                            {individualbannerimage.ContentType0 == 'Image'
                                ? <img onClick={() => this.imageRedirect(individualbannerimage.ImageUrl, individualbannerimage.NavigateURLType, individualbannerimage.ID)} src={individualbannerimage.File.ServerRelativeUrl} />
                                : (individualbannerimage.ContentType0 == 'Video'
                                    ? <video width="100%" height="350px" controls src={individualbannerimage.File.ServerRelativeUrl}>
                                           Your browser does not support HTML5 video.</video>
                                    : (individualbannerimage.ContentType0 == 'Text'
                                        ? <p className="bannertext-mobileview" dangerouslySetInnerHTML={{ __html: individualbannerimage.ImageDescription }}></p>
                                        : null
                                    )
                                )
                            } 
                             <div className="banner-parentdiv">
                                <p className="banner-childtext">{individualbannerimage.ImageTitle} <span><a onClick={() => this.imageRedirect(individualbannerimage.ImageUrl, individualbannerimage.NavigateURLType, individualbannerimage.ID)} className="banner_readmore">Read More</a></span></p>
                              </div>
                         </li>
                    )}
                  </ul>
               </div>
             
             )
         }
     }
ReactDOM.render(<DeparmentHomeCarousel />, document.getElementById('DepartmentHomeCarousel'));
