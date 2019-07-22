class PopularViewAll extends React.Component {
    constructor(props) {
     super(props);
       this.state = {
           DepartmentspopularList: [],
           currentPage: 1,
        }
    }
    handleClick = (event) => {
        this.setState({
            currentPage: Number(event.target.id)
        });
        $('#page-numbers li').css('background-color', 'black');
        $(event.target).css('background-color', 'red')
    }
    componentDidMount() {
        var errorMessage = '';
        var appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
        appweburl = appweburl.substring(0, appweburl.lastIndexOf('/'));
        var id = getQueryStringParameter('ID');
        if (id != "" && id != null) {
            var subsitelinkQuery = constants.subsiteLinksQuery + id;
            var subsitelinkUrl = appweburl + "/_api/web/lists/getbytitle('" + constants.subsiteLinkslistName + "')/items" + subsitelinkQuery
            getServiceCall(subsitelinkUrl).then(data => {
                this.setState({
                    DepartmentspopularList: data.d.results
                })
                Communica.Part.init('PopularViewAll', 20);
            }, error => {
                errorMessage = error.responseJSON.error.message;
                DepartmentLogerror('PopularViewAll', 'PopularViewAll', 'getServiceCall-OnpageLoad', errorMessage)
            });
        }
        else {
            var getpopularLinkUrl = appweburl + "/_api/web/lists/getbytitle('" + constants.PLibraryName + "')/items" + constants.popularLinkQuery
            getServiceCall(getpopularLinkUrl).then(data => {
                this.setState({
                    DepartmentspopularList: data.d.results
                })
                Communica.Part.init('PopularViewAll', 20);
            }, error => {
                errorMessage = error.responseJSON.error.message;
                DepartmentLogerror('PopularViewAll', 'PopularViewAll', 'getServiceCall-OnpageLoad', errorMessage)
            });
        }
       
    }
    render() {
        const { DepartmentspopularList, currentPage } = this.state;
        const indexOfLastItem = currentPage * departmentPageCount;
        const indexOfFirstItem = indexOfLastItem - departmentPageCount;
        const renderItems = DepartmentspopularList.slice(indexOfFirstItem, indexOfLastItem).map((item, index) => {
            return <li key={index}><a href={item.Popularlink} target="parent">{item.Title}</a></li>;
        });

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(DepartmentspopularList.length / departmentPageCount); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}>{number}
                </li>
            );
        });
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-xs-12">
                            <div className="row">
                                <div className="col-md-2 col-xs-12"></div>
                                <div className="col-md-8 col-xs-12">
                                        <div className="seeall-welledit">
                                            <p className="title-header">Popular Links</p>
                                        <p><label className="popular_redline"></label></p>
                                        {this.state.DepartmentspopularList && (this.state.DepartmentspopularList != 0) ?
                                            <div>
                                                <div className="table-responsive top1 ">
                                                    <table className="table fulltable ">
                                                        <tbody className="tbl-body">
                                                            <tr>
                                                                <td>{renderItems}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="top2 clearfix">
                                                    <div className="pull-right">
                                                        <ul id="page-numbers">{renderPageNumbers}</ul>
                                                    </div>
                                                </div>
                                            </div>
                                            : <label className="lbl-text">There are no list to display</label>
                                        }
                                        </div>
                                </div>
                                <div className="col-md-2 col-xs-12"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
ReactDOM.render(<PopularViewAll />, document.getElementById('PopularViewAll'));
