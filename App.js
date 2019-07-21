
import React from 'react';
import { createSwitchNavigator } from "@react-navigation/core";
import { createBrowserApp, Link } from "@react-navigation/web";

const API = 'https://cdn-discover.hooq.tv/v1.2/discover/feed?region=ID&perPage=20&page='
const DEFAULT_QUERY = '1';

const detAPI = 'https://cdn-discover.hooq.tv/v1.2/discover/titles/'
const detquery = "796a53a9-28f1-4436-8a97-d989abf53320"

class Home extends React.Component {
	
	
	constructor(props) {
		super(props);

		this.state = {
			movies: [],
			error: null,
			pageid: 1,
			
		};
		
		this.nav = React.createRef();
		this.lastScrollY = 0;
		this.ticking = false;
		
		
	}
  
	componentDidMount() {
		
		console.log('add');
		window.addEventListener('scroll', this.handleScroll.bind(this));

		console.log('>>>>>>>>>' + this.state.pageid);
		fetch(API + this.state.pageid)
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Something went wrong ...');
			}
		})
		.then(data => 
			{
				this.setState({ movies: data.data});
				window.scrollTo(0, 0);
			}
		)
		.catch(error => this.setState({ error }));
	}
	
	componentWillUnmount() {
		console.log('remove');
		window.removeEventListener('scroll', this.handleScroll.bind(this));
	}
	
	fetching(pageId){
		fetch(API + pageId)
		.then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error('Something went wrong ...');
			}
		})
		.then(data => 
			{
				this.setState({ movies: data.data});
				window.scrollTo(0, 0);
			}
		)
		.catch(error => this.setState({ error }));
	}

	handleScroll(e) {
		
		//e.preventDefault();
		//var { pageid } = this.state;
		
		//this.lastScrollY = window.scrollY;
		//const wrappedElement = document.getElementById('header');
		//console.log(wrappedElement.getBoundingClientRect().bottom + 
		//	' <> ' + window.innerHeight)
		//if (wrappedElement.getBoundingClientRect().bottom <= window.innerHeight) {
		//	console.log('header bottom reached');
		//	console.log(pageid);
		//	var nextPageid = parseInt(this.state.pageid) + 1;
		//	this.setState({pageid: nextPageid });
		//	console.log(nextPageid);
		//	document.removeEventListener('scroll', this.handleScroll);
		//}
		
	};
  
	render() {
		
		const { movies, isLoading, error, pageid } = this.state;
		
		if (error) {
			return <p>{error.message}</p>;
		}
	
		if (isLoading) {
			return <p>Loading ...</p>;
		}
		return (
			<div id="header"><nav ref={this.nav}>
				{
					movies.map((movie) =>
						movie.type === "Multi-Title-Manual-Curation" ? 
							
							
							<div key={movie.row_id}>
								Main Type: {movie.type} 
									{
										movie.data.map(mm => 
											
											<div>
											 
												{
													mm.images.map(img => 
														img.type === "POSTER" ? 
														<div>
															<img src={img.url} height="230px" 
															onClick={() => {
																window.removeEventListener('scroll', this.handleScroll.bind(this));
																/* 1. Navigate to the Details route with params */
																this.props.navigation.navigate('Details', {
																	pageid: mm.id,
																	
																});
															}} 
															/>
														</div>
														: <span/>
													)
												}
												{mm.title}
											</div>
											
											
										)
										
									}
							
							</div>
							
							
						
						:	<span></span>					
						
					)
				}
				
				<div>
					<input type="button" value="Back" onClick={() => {
						var nextPageid = parseInt(this.state.pageid) - 1;
						nextPageid = nextPageid < 1 ? 1:nextPageid;
						console.log(nextPageid);
						this.setState({pageid: nextPageid});
						this.fetching(nextPageid);
					}} />
					<input type="button" value="Next" onClick={() => {
						var nextPageid = parseInt(this.state.pageid) + 1;
						console.log(nextPageid);
						this.setState({pageid: nextPageid});
						this.fetching(nextPageid);
					}} />
				</div>
				</nav>
				
			</div>
			
			
		);
	}
	
	
}


class Details extends React.Component {
	
	
	constructor(props) {
		super(props);
		console.log('con');
		const { navigation } = this.props;
		//const itemId = navigation.getParam('pageid', 'no-id');
		
		this.state = {
			movies: [],
			error: null,
			pageid: navigation.getParam('pageid', 'no-id'),
			isLoading: true,
		};
	}
	
	componentDidMount() {
		console.log('con2');
		var itemId = this.state.pageid;
		console.log(">>>>>" + itemId);
		
		
		if(itemId || itemId != 'no-id') {
			fetch(detAPI + itemId)
			//fetch(detAPI + detquery)
			.then(response => {
				if (response.ok) {
					
					return response.json();
				} else {
					throw new Error('Something went wrong ...');
				}
			})
			.then(mov => {
				this.setState({ movies: mov.data, isLoading: false })
				console.log('>>' + this.state.movies);
				}
			)
			.catch(error => this.setState({ error, isLoading: false }));
		
		}
	}
  
	render() {
		console.log('con3');
		const { movies, isLoading, error } = this.state;	
			
		if (error) {
			return <p>{error.message}</p>;
		}
	
		if (isLoading) {
			return <p>Loading ...</p>;
		}
		
		console.log(">>" + movies.images)
		console.log(">>>>" + this.state.movies.images)
		
		if (!movies.images) {
			return <p>Loading ...</p>;
		}
		
		//var moviesStr = [];
		//moviesStr.push(movies);
		
		var jsonstr = JSON.stringify(movies);
		console.log("???" + jsonstr);
		jsonstr = '['+jsonstr+']';
		var movieslist = JSON.parse(jsonstr);
		console.log("???" + movieslist);
		
		
		return (
				
			<div>
			<h1>Movie Details: </h1>
				{
					movieslist.map((movie) => 
					
					
					<div>
						<table>
							<tbody>
							<tr>
								<td>
									{
										
										movie.images.map(img => 
												img.type === "POSTER" ? 
												<div>
													<img src={img.url} width="250px"/>
												</div>
												: <span/>
										)
									}
								</td>
								<td>
									<table>
									<tbody>
									<tr>
										<td>Title:</td>
										<td>{movie.title}</td>
									</tr>
									<tr>
										<td>Description:</td>
										<td>{movie.description}</td>
									</tr>
									<tr>
										<td>Type:</td>
										<td>{movie.as}</td>
									</tr>
									<tr>
										<td>Region:</td>
										<td>{movie.region}</td>
									</tr>
									<tr>
										<td>Audios:</td>
										<td>
											<ul>
											{
												movie.audios.map(audio => 
													<li>
													{audio}
													</li>
												)
											}
											</ul>
										</td>
									</tr>
									<tr>
										<td>Streamable: </td>
										<td>{movie.streamable ? "Yes":"No"}
										</td>
									</tr>
									<tr>
										<td>Downloadable: </td>
										<td>{movie.downloadable ? "Yes":"No"}
										</td>
									</tr>
									
									<tr>
										<td>People: </td>
										<td>{
											<table>
											<tbody>
											<tr>
												<th>Name</th><th>Role</th>
											</tr>
											
											{
												movie.people.map(per => 
													<tr><td>{per.name}</td><td>{per.role}</td></tr>
												)
											}
											</tbody>
											</table>
											}
										</td>
									</tr>
									</tbody>
									</table>
								</td>
							</tr>
							</tbody>
						</table>
						<div>
								<input type="button" value="Back" onClick={() => {
								this.props.navigation.navigate('Home');
								}} />
						</div>
						
						
					</div>	
					)
				}
			</div>
		
			
		);
	}
	
	
}


const AppNavigator = createSwitchNavigator(
{
	Home,
	Details,
}
	);

const App = createBrowserApp(AppNavigator);
export default App;