<%--

    Licensed to Jasig under one or more contributor license
    agreements. See the NOTICE file distributed with this work
    for additional information regarding copyright ownership.
    Jasig licenses this file to you under the Apache License,
    Version 2.0 (the "License"); you may not use this file
    except in compliance with the License. You may obtain a
    copy of the License at:

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on
    an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied. See the License for the
    specific language governing permissions and limitations
    under the License.

--%>

<jsp:directive.include file="/WEB-INF/jsp/include.jsp"/>

<c:set var="n"><portlet:namespace/></c:set>

<%--

--%>
<portlet:actionURL var="invokeNotificationServiceUrl" escapeXml="false">
    <portlet:param name="uuid" value="${uuid}"/>
    <portlet:param name="action" value="invokeNotificationService"/>
</portlet:actionURL>

<%--
 Favorites URL 
    - replace notificationid with jobId
    - replace actionId with favorite/unfavorite
--%>
<portlet:actionURL var="invokeActionUrlTemplate" escapeXml="false">
    <portlet:param name="notificationId" value="NOTIFICATIONID"/>
    <portlet:param name="actionId" value="ACTIONID"/>
</portlet:actionURL>

<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

<link rel="stylesheet" href="<c:url value="/styles/job-postings.css"/>" type="text/css"></link>
<!--[if lt IE 10]>
<style>
    .job-postings .searchControls ul li {
        width: 50%;
        float: left
    }
</style>
<![endif]-->


<div class="job-postings bootstrap-styles">
    <div id="loading" class="container-fluid">
        <div id="floatingCirclesG">
            <div class="f_circleG" id="frotateG_01"></div>
            <div class="f_circleG" id="frotateG_02"></div>
            <div class="f_circleG" id="frotateG_03"></div>
            <div class="f_circleG" id="frotateG_04"></div>
            <div class="f_circleG" id="frotateG_05"></div>
            <div class="f_circleG" id="frotateG_06"></div>
            <div class="f_circleG" id="frotateG_07"></div>
            <div class="f_circleG" id="frotateG_08"></div>
        </div>
    </div>

    <div id="jobView">
        <nav class="navbar navbar-default" role="navigation">
          <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
              <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul class="nav navbar-nav primary-nav">
                <li class="active"><a href="" data-action="all" id="navSearch">Search</a></li>
                <li><a href="" data-action="saved" id="navSaved">Saved Jobs</a></li>
              </ul>
              <ul class="nav navbar-nav navbar-right secondary-nav">
                <li><a href="peoplesoft.univ/saved-searches" target="_blank">Saved Searches</a></li>
                <li><a href="peoplesoft.univ/career-tools" target="_blank">Career Tools</a></li>
              </ul>
            </div><!-- /.navbar-collapse -->
          </div><!-- /.container-fluid -->
        </nav>

        <div class="container-fluid" style="margin-top: 10px">
            <%--
            <!-- Button trigger modal -->
            <div class="row">
                <button class="btn btn-primary btn-xs" data-toggle="modal" data-target="#jobDetailsModal">
                  Launch demo modal
                </button>
                <button class="btn btn-primary btn-xs" data-toggle="modal" data-target="#jobDetailsModal">
                  Launch demo modal again
                </button>
                <button class="btn btn-primary btn-xs" id="isFiltered">
                  Clear Filter
                </button>
            </div>
            --%>
            <div class="row">
                <div class="searchControls search-form col-md-5">
                    <h3>Search</h3>
                    <form role="form">
                      <div class="form-group">
                        <label for="searchTerms" class="sr-only">Search Terms:</label>
                        <input type="text" class="form-control input-sm" id="searchTerms" placeholder="Enter keyword, Job Id, etc">
                      </div>
                      <div class="form-group">
                        <label for="searchDates" class="sr-only">Date Range:</label>
                        <select class="form-control input-sm" id="date-range">
                            <option value="">All</option>
                            <option value="03/27/2014">Past Week</option>
                            <option value="03/03/2014">Past Month</option>
                            <option value="10/03/2013">Past 6 Months</option>
                            <option value="04/03/2013">Past Year</option>
                        </select>
                      </div>
                      <button type="button" class="btn btn-primary btn-sm" id="searchButton">Search</button>
                    </form>
                </div>
    <%--            <div class="search-separator col-md-1">- or -</div>--%>
                <div class="search-separator col-md-2"></div>
                <div class="searchControls search-filter col-md-5">
                    <h3>Filter</h3>
                    <form role="form">
                        <div class="row">
                            <div class="col-md-12">
                                <ul>
                                    <li class="checkbox"><label><input type="checkbox" value="Academic">Academic</label></li>
                                    <li class="checkbox"><label><input type="checkbox" value="Clerical">Clerical</label></li>
                                    <li class="checkbox"><label><input type="checkbox" value="Computer">Computer</label></li>
                                    <li class="checkbox"><label><input type="checkbox" value="Event/Program/Project">Event/Program/Project</label></li>
                                    <li class="checkbox"><label><input type="checkbox" value="MTC">MTC</label></li>
                                    <li class="checkbox"><label><input type="checkbox" value="Miscellaneous">Miscellaneous</label></li>
                                </ul>
                            </div>
                        </div>
                        <div class="row"><div class="col-md-12"><button type="submit" class="btn btn-primary btn-sm" id="filterButton">Filter</button></div></div>
                    </form>
                </div>
            </div>

            <div class="row mine">
                <div class="col-sm-12">
                    <!-- <label><input type="checkbox" id="toggle-checkbox"> Hide 'apply in person' jobs</label> -->
                    <div class="table-responsive">
                        <table class="jobs-table table table-striped table-bordered" id="jobPostings">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th>Job Title</th>
                                    <th>Date</th>
                                    <th class="hidden-xs">Job ID</th>
                                    <th>Department</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade job-details" id="jobDetailsModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <%-- <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="myModalLabel">{{job-title}}</h4>
              </div>
              <div class="modal-body">
                place job description here...
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div> --%>
            </div>
          </div>
        </div>
    </div>
</div> <!-- bootstrap-styles -->

<script type="text/template" id="jobDescriptionModal">
{{ if (emailFriend) { }}
<div id="modal-overlay">
    <div class="container-fluid">
        <form id="emailFriendForm" role="form">
          <div class="form-group">
            <label for="emailAddress"><h4>Enter Email Address:</h4></label>
            <input type="text" class="form-control input-sm" id="emailAddress" name="emailAddress" />
            <input type="hidden" name="jobId" value="{{= id }}">
          </div>
          <button type="button" class="btn btn-default" id="cancelEmailButton">Cancel</button>
          <button type="button" class="btn btn-primary" id="sendEmailButton">Send</button>
        </form>
    </div>
</div>
{{ } }}
<div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h4 class="modal-title" id="myModalLabel">{{=title}}</h4>
</div>
<div class="modal-body container-fluid">
    <div class="row">
        <div class="col-md-7">
            <div class="row">
                <div class="col-sm-12">
                    <h4>Description</h4>
                </div>
                <div class="col-md-10 col-md-offset-1">
                    {{=attributes.description}}
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <h4>Qualifications</h4>
                </div>
                <div class="col-md-10 col-md-offset-1">
                    {{=attributes.qualifications}}
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <h4>Application Instructions</h4>
                </div>
                <div class="col-md-10 col-md-offset-1">
                    {{=attributes.instructions}}
                </div>
            </div>
        </div>
        <div class="col-md-5">
            <div class="sidebar">
                <div class="row">
                    <div class="col-md-12">
                        <h5>{{=attributes.status}}</h5>
                        <h5>Date Posted: {{=attributes.postDate}}</h5>
                        <h5>Job ID: {{=attributes.postDate}}</h5>
                    </div>
                </div>
                <hr />
                <div class="row">
                    <div class="col-md-12"><h5>Additional Information</h5></div>
                </div>
                <div class="row">
                    <div class="col-md-5">Openings:</div>
                    <div class="col-md-7">{{=attributes.openings}}</div>
                </div>
                <div class="row">
                    <div class="col-md-5">Location:</div>
                    <div class="col-md-7">{{=attributes.location}}</div>
                </div>
                <div class="row">
                    <div class="col-md-5">Start Date:</div>
                    <div class="col-md-7">{{=attributes.startDate}}</div>
                </div>
                <div class="row">
                    <div class="col-md-5">Shift:</div>
                    <div class="col-md-7">{{=attributes.shift}}</div>
                </div>
                <div class="row">
                    <div class="col-md-5">Hourly Wage:</div>
                    <div class="col-md-7">{{=attributes.wage}}</div>
                </div>
                <div class="row">
                    <div class="col-md-12 closingDate">Closing Date: {{=attributes.dateClosed}}</div>
                </div>

            </div>
        </div>
    </div>
</div>
<div class="modal-footer">
    <div class="row">
        <div class="col-sm-6 text-left">
        {{ if (emailFriend) { }}
            <button type="button" class="btn btn-default" id="emailFriendButton">Email to Friend</button>
        {{ } }}
        </div>
        <div class="col-sm-6">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            {{ if (attributes.status[0].toLowerCase() === 'open') { }}
            <a href="{{= url }}" target="_blank" class="btn btn-primary" id="applyButton" data-dismiss="modal">Apply</a>
            {{ } else { }}
            <button type="button" class="btn btn-primary disabled">Apply in Person</button>
            {{ } }}
        </div>
    </div>
            
</div>
</script>

<script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="//ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.min.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js"></script>

<script type="text/javascript">
    var jp_ = _.noConflict();

    var urls = {
        // Prime the pump with this URL
        invokeNotificationServiceUrl: '${invokeNotificationServiceUrl}',

        // Get JSON with this one
        getNotificationsUrl: '<portlet:resourceURL id="GET-NOTIFICATIONS-UNCATEGORIZED"/>',

        // Favorite/un-favorite
        invokeActionUrlTemplate: '${invokeActionUrlTemplate}',

        testJson: '<c:url value="/scripts/jobs.json"/>'
    }

    jp_.templateSettings = {
      //interpolate : /\{\{(.+?)\}\}/g
      evaluate    : /\{\{([\s\S]+?)\}\}/g,
      interpolate : /\{\{=([\s\S]+?)\}\}/g,
      escape      : /\{\{-([\s\S]+?)\}\}/g
    };

</script>



<script type="text/javascript">
    $(document).ready(function() {
        jobPostings.init(urls);
    });


// var template = jp_.template("Hello {{ name }}!");

// console.log(template({name: "Mustache"}));
// 
//jp_.template($("#jobDescriptionModal").html())

</script>

<script src="<c:url value="/scripts/job-postings.js"/>"></script>