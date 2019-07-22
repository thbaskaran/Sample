class DepartmentSubSitesItems extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subsitelinks: [],
            subsitedocs: [],
            OrgsLib: []

        }
    }

    componentDidMount() {
        var errorMessage = '';
        var appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
        appweburl = appweburl.substring(0, appweburl.lastIndexOf('/'));
        var id = getQueryStringParameter('ID');
        var subsitelinkQuery = constants.subsiteLinksQuery + id;
        var subsitelinkUrl = appweburl + "/_api/web/lists/getbytitle('" + constants.subsiteLinkslistName + "')/items" + subsitelinkQuery
        getServiceCall(subsitelinkUrl).then(data => {
            this.setState({
                subsitelinks: data.d.results
            })
        }, error => {
            errorMessage = error.responseJSON.error.message;
            DepartmentLogerror('DepartmentSubSitesItems', 'DepartmentSubSitesItems-popularlinks', 'getServiceCall-OnpageLoad', errorMessage)
        })
        var subsitedocQuery = constants.subsiteDocQuery + id;
        var subsitedocUrl = appweburl + "/_api/web/lists/getbytitle('" + constants.subsiteDocLibaryName + "')/items" + subsitedocQuery
        getServiceCall(subsitedocUrl).then(data => {
            this.setState({
                subsitedocs: data.d.results
            })
        }, error => {
            errorMessage = error.responseJSON.error.message;
            DepartmentLogerror('DepartmentSubSitesItems', 'DepartmentSubSitesItems-document', 'getServiceCall-OnpageLoad', errorMessage)
        })
        var OrgQuery = constants.OrgQuery + id;
        var OrgUrl = appweburl + "/_api/web/lists/getbytitle('" + constants.OrgLibrary + "')/items" + OrgQuery
        getServiceCall(OrgUrl).then(data => {
            this.setState({
                OrgsLib: data.d.results
            })
            Communica.Part.init('DepartmentSubSitesItemsId',500);
        }, error => {
            errorMessage = error.responseJSON.error.message;
            DepartmentLogerror('DepartmentSubSitesItems', 'DepartmentSubSitesItems-organisation', 'getServiceCall-OnpageLoad', errorMessage)
        })
    }
    seeallpopularlinks = (e) => {
        var appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
        appweburl = appweburl.substring(0, appweburl.lastIndexOf('/'));
        e.preventDefault();
        var id = getQueryStringParameter('ID');
        window.open(appweburl + '/Pages/PopularLinks.aspx?BID=' + id, '_blank');
    }
    seeallpopulardocuments = (e) => {
        var appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
        appweburl = appweburl.substring(0, appweburl.lastIndexOf('/'));
        e.preventDefault();
        var id = getQueryStringParameter('ID');
        window.open(appweburl + '/Pages/PopularDocuments.aspx?BID=' + id, '_blank');
    }
    render() {
        var size = 6;
        return (
            <div>
                <div className="container">
                    <div className="row top1">
                        <div className="col-md-12 col-xs-12">
                            <div className="outerdiv">
                                <p className="title-header">Organization Chart</p>
                                <p><label className="popular_redline"></label></p>
                                <div className="text-center">
                                    {
                                        this.state.OrgsLib && this.state.OrgsLib.slice(0, 1).map((user, index) =>
                                            <a href={user.Link} target="_parent"><img src={user.File.ServerRelativeUrl}></img></a>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-xs-12">
                            <div className="row">
                                <div className="col-md-6 col-xs-12">
                                    <div className="seeall-welledit">
                                        <div className="popular_links">
                                            <div>
                                                <p className="fontsize_16"><b>Popular Links</b> <label className="pull-right c-all" onClick={this.seeallpopularlinks}>See All</label></p>
                                                {this.state.subsitelinks && this.state.subsitelinks.slice(0, size).map((individuallinks, index) =>
                                                    <p><a href={individuallinks.Popularlink} target="_parent">{individuallinks.Title}</a></p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xs-12">
                                    <div className="seeall-welledit">
                                        <div className="popular_links">
                                            <div>
                                                <p className="fontsize_16"><b>Popular Documents</b> <label className="pull-right c-all" onClick={this.seeallpopulardocuments}>See All</label></p>
                                                {this.state.subsitedocs && this.state.subsitedocs.slice(0, size).map((individualdocs, index) =>
                                                    <p><a href={individualdocs.File.ServerRelativeUrl + "?web=1"} target="_parent">{individualdocs.File.Name}</a></p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<DepartmentSubSitesItems />, document.getElementById('DepartmentSubSitesItemsId'));
