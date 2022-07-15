import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
	ondemandList,
	clearOndemandList,
	start_loader,
	stop_loader,
	updateOffset,
	setGoback,
	setCurrentPosition,
	pushHistory,
	ondemandCMSModelOpen,
	ondemandDetail,
	clearOndemandDetail,
	getAllFilters,
	getQuickLinks
} from "../../actions";
import { commonService } from "../../_services";
import * as constand from "../../constant";
import WorkoutSaveComponent from "./workoutSaveComponent";
import WorkoutScheduleComponent from "./WorkoutScheduleComponent";
import AnimateLoaderComponent from "../../_layoutComponents/AnimateLoaderComponent";
import { toast } from "react-toastify";
import InputRange from "react-input-range";
import { ImageTag, TextWrap } from "../../tags";
import { Helmet } from "react-helmet";
import WorkoutCMSComponent from "./WorkoutCMSComponent";
import AdminBanner from "../Common/AdminBanner";
import ReactGA from 'react-ga';
import SortByComponent from "../Common/SortByComponent";
import OndemandSearchComponent from "../Common/OndemandSearchComponent";
import FilterComponent from "../Common/FilterComponent";

class WorkoutsComponent extends React.Component {
	_isMounted = false;
	constructor(props) {
		super(props);
		this.state = {
			ondemandList: [],
			typeFilter: this.props.params.condition,
			show_more_cnt: constand.ONDEMAND_LIST_CNT,
			sort_filter: "Duration",//"Newest first",
			search_data: "",
			offset: 0,
			isDraft: 0,
			list_count: 0,
			lenthFilter_max: constand.VIDEO_RANGE_MAX,
			is_filter_open: false,
			available_filter: {},
			selected_filter: {},
			filterNames: [
				"condition",
				"lengthFilter",
				"videoType",
				"level",
				"benefit",
				"discipline",
				"equipment",
				"instructor"
			],
			is_filter_clicked: false,
			loader: true,
			all_tags: [],
			all_levels: [],
			is_cms_model: false,
			isInitFilter: false,
			init_available_filter: [],
			quickLinks: [],
			hover: []
		};
		//this.wrapperRef = [];

		this.lastState = this.props.params.condition;
		this.getOnDemandList = this.getOnDemandList.bind(this);
		this.incrementShowmoreCnt = this.incrementShowmoreCnt.bind(this);
		this.sortByFunction = this.sortByFunction.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.searchFucntion = this.searchFucntion.bind(this);
		this.filterFunction = this.filterFunction.bind(this);
		this.rangeChangeFunction = this.rangeChangeFunction.bind(this);
		this.filterClickUpdate = this.filterClickUpdate.bind(this);
		this.handlePosition = this.handlePosition.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
		this.afterSaveCMS = this.afterSaveCMS.bind(this);
		this.getInitialAllFilters = this.getInitialAllFilters.bind(this);
		this.getQuickLinks = this.getQuickLinks.bind(this);
		this.DraftData = this.DraftData.bind(this);
	}

	componentDidMount() {
		this.props.ondemandCMSModelOpen({ open: false })
		document.addEventListener('mousedown', this.handleClickOutside);
		window.scrollTo(0, 0);
		this.getInitialAllFilters();
		this.getQuickLinks()
	}
	componentDidUpdate() {
		var headerHt = document.getElementsByClassName('navbar navbar-expand-lg navbar-light bg-white fixed-top')[0].getBoundingClientRect().height;
		if (this.props.currentPosition) {
			console.log('didupdate', this.props.currentPosition);
			var finalPosition = this.props.currentPosition > headerHt ? this.props.currentPosition - headerHt : this.props.currentPosition;
			console.log('finalPosition', finalPosition)
			window.scrollTo(0, finalPosition);
			/* setTimeout(() => {
			  this.props.setGoback(false)
			}, 1000) */
		}
	}
	componentWillMount() {
		this._isMounted = true;
		this.props.clearOndemandList();
		this.onHeadeUrlChange();
		// this.getOnDemandList();
	}
	componentWillReceiveProps(props) {
		console.log('componentWillReceiveProps')
		if (this.lastState != props.params.condition) {
			this.lastState = props.params.condition;
			this.setState(
				{
					typeFilter: props.params.condition
				},
				function () {
					this.getInitialAllFilters();
					this.getQuickLinks()
					this.componentWillMount();
				}
			);
		}
	}
	//set current position for focusing again back from details page
	handlePosition(e) {
		this.props.setGoback(false);
		console.log('current postiion', e.target.getBoundingClientRect())
		this.props.setCurrentPosition(e.target.getBoundingClientRect().top)
	}
	handleClickOutside(event) {
		console.log('event', event.target.className)
		//if (this.wrapperRef && !this.wrapperRef.contains(event.path[0])) {
		if ((this.wrapperRef && !this.wrapperRef.props.className.match(event.target.className)) || event.target.className !== 'fa fa-calendar-o pointer') {
			console.log('yes')
			this.props.setCurrentPosition(0)
		}
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
		this._isMounted = false;
		this.props.clearOndemandList();
		this.setState({
			ondemandList: [],
			all_levels: [], all_tags: [],
			typeFilter: this.props.params.condition,
			show_more_cnt: constand.ONDEMAND_LIST_CNT,
			sort_filter: "",
			search_data: "",
			offset: 0,
			list_count: 0,
			is_filter_open: false,
			available_filter: {},
			selected_filter: {}
		});
	}
	handleChange(e) {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}
	incrementShowmoreCnt(type) {

		this.props.setGoback(false)
		this.props.setCurrentPosition(0)

		if (type == 'all') {
			ReactGA.event({
				category: "On Demand Video List",
				action: "Clicked Show Button  ",
				label: "Show All"
			})
			/* var last_page = Math.ceil(this.state.list_count / constand.ONDEMAND_LIST_CNT);
			var lastpageCount = 0;
			if ((last_page * constand.ONDEMAND_LIST_CNT) <= this.state.list_count) {
			  lastpageCount = (last_page) * constand.ONDEMAND_LIST_CNT
			} else {
			  lastpageCount = (last_page - 1) * constand.ONDEMAND_LIST_CNT
			} */
			var lastpageCount = this.state.list_count;
			this.props.clearOndemandList();

			//var offsetCount = this.state.offset + constand.ONDEMAND_LIST_CNT;
			this.props.updateOffset(lastpageCount)
			this.setState(
				{
					loader: true,
					limit: 0,
					offset: lastpageCount //this.state.offset + constand.ONDEMAND_LIST_CNT
				},
				function () {
					this.getOnDemandList(true);
				}
			);
		} else {
			ReactGA.event({
				category: "On Demand Video List",
				action: "Clicked Show Button  ",
				label: "Show More"
			})
			var offsetCount = this.state.offset + constand.ONDEMAND_LIST_CNT;
			this.props.updateOffset(offsetCount)
			this.setState(
				{
					loader: true,
					offset: offsetCount //this.state.offset + constand.ONDEMAND_LIST_CNT
				},
				function () {
					this.getOnDemandList();
				}
			);
		}

	}

	DraftData(type) {

		this.props.setGoback(false)
		this.props.setCurrentPosition(0)

		if (type) {
			console.log("Draft-list");
			// var lastpageCount = this.state.list_count;
			this.props.clearOndemandList();
			//var offsetCount = this.state.offset + constand.ONDEMAND_LIST_CNT;
			// this.props.updateOffset(lastpageCount)
			this.setState(
				{
					loader: true,
					isDraft: 1,
				},
				function () {
					this.getOnDemandList(true);
				}
			);
		} else {
			console.log("Live-list");
			// var lastpageCount = this.state.list_count;
			this.props.clearOndemandList();
			//var offsetCount = this.state.offset + constand.ONDEMAND_LIST_CNT;
			// this.props.updateOffset(lastpageCount)

			this.setState(
				{
					loader: true,
					isDraft: 0 //this.state.offset + constand.ONDEMAND_LIST_CNT
				},
				function () {
					this.getOnDemandList(true);
				}
			);
		}

	}
	sortByFunction(item) {
		console.log('item', item)
		ReactGA.event({
			category: "On Demand Video List",
			action: "Sorted ",
			label: item,
		})
		this.props.clearOndemandList();
		this.setState({ ondemandList: [], all_levels: [], all_tags: [], sort_filter: item, offset: 0 }, function () {
			//this.getOnDemandList();
			this.onHeadeUrlChange(null, null, item);
		});
	}

	filterClickUpdate() {
		this.props.setGoback(false)
		this.props.setCurrentPosition(0)

		if (this.state.is_filter_clicked === true) {
			this.setState({ is_filter_clicked: false });
		} else {
			this.setState({ is_filter_clicked: true });
		}
	}
	filterFunction(name, value) {
		if (name === 'discipline') {
			ReactGA.event({
				category: "On Demand Video List",
				action: "Filtered ",
				label: value,
			})
		}
		this.props.clearOndemandList();
		var temp = { ...this.state.selected_filter };
		if (!temp[name]) {
			temp = {
				condition: [],
				lengthFilter: "",
				videoType: [],
				level: [],
				benefit: [],
				discipline: [],
				equipment: [],
				instructor: []
			};
		}
		if (name != 'lengthFilter') {
			var index = temp[name].indexOf(value);
			if (index > -1) {
				temp[name].splice(index, 1);
			} else {
				temp[name].push(value);
			}
			this.setState({ ondemandList: [], all_levels: [], all_tags: [], selected_filter: temp, offset: 0 }, function () {
				// this.getOnDemandList();
				this.onHeadeUrlChange("filter", name);
			});
		} else {
			temp[name] = '';
			console.log('name', name);
			console.log('selected_filter-temp', temp);

			this.setState({ ondemandList: [], all_levels: [], all_tags: [], selected_filter: temp, offset: 0, rangeSelectedValue: 0 + ',' + 0 }, function () {
				// this.getOnDemandList();
				this.onHeadeUrlChange(null, name, null, true);
			});
		}

	}

	/**
	 * on url change
	 */
	onHeadeUrlChange(isFilter = null, filterName = null, isSort = null, isLengthFilter = null) {
		console.log('existing search', this.props)
		console.log('existing-filterName', filterName)
		var existingSearchData = this.props.history.location.search;
		var existingSearch = this.props.history.location.search;
		var temp = {
			condition: [],
			lengthFilter: "",
			videoType: [],
			level: [],
			benefit: [],
			discipline: [],
			equipment: [],
			instructor: []
		};
		var sortbyOld = '';
		var tempOld = { ...this.state.selected_filter };
		let newUrl = "";
		if (existingSearch) {
			existingSearch = existingSearch.split("?");
			var searchQuery = existingSearch[1];
			searchQuery = searchQuery.split("&");
			if (searchQuery) {
				console.log('searchQuery', searchQuery)
				var searchNameArr = [];
				var array_data = [];

				searchQuery.map((item, key) => {
					let searchData = item.split("=");
					let searchName = searchData[0];
					searchNameArr.push(searchName);
					let searchParams = searchData[1];
					let searchParamsSplit = searchParams.split("-").join(" ");
					searchParamsSplit = searchParamsSplit.split(",");
					if (searchName !== 'sortby' && (searchName !== 'len%3E' && searchName !== 'len%3C' && searchName !== 'len>' && searchName !== 'len<')) {
						temp[searchName] = [];
						temp[searchName] = searchParamsSplit;
					}
					if (filterName !== searchName && isFilter === "filter") {
						let newParams =
							tempOld && tempOld[searchName]
								? tempOld[searchName].join(",")
								: "";
						newParams = newParams.split(" ").join("-");
						if (newParams) {
							newUrl = newUrl
								? `${newUrl}&${searchName}=${newParams}`
								: `${newUrl}?${searchName}=${newParams}`;
						}
					}
					console.log('searchName', searchName)
					if (searchName === 'sortby') {
						if (isSort) {
							console.log('searchName-isSort-', isSort)
							let newParams = isSort.split(" ").join("-");
							newUrl = newUrl
								? `${newUrl}&sortby=${newParams}`
								: `${newUrl}?sortby=${newParams}`;
						} else {
							sortbyOld = searchParams.split("-").join(" ");
							console.log('seachname-else-issort')
							newUrl = newUrl
								? `${newUrl}&sortby=${searchParams}`
								: `${newUrl}?sortby=${searchParams}`;
						}
					} else if (searchName == 'len%3E' || searchName == 'len%3C' || searchName == 'len>' || searchName == 'len<') {
						console.log('seachname-length', searchParams)
						var newValue = this.state.selected_filter['lengthFilter'] ? this.state.selected_filter['lengthFilter'].split(',') : [];
						if (!isLengthFilter) {
							console.log('newValue', newValue)
							if (searchName === 'len%3E' || searchName === 'len>') {
								newUrl = newUrl
									? `${newUrl}&${searchName}=${newValue.length > 0 ? newValue[0] : searchParams}`
									: `${newUrl}?${searchName}=${newValue.length > 0 ? newValue[0] : searchParams}`;
								array_data.push(newValue.length > 0 ? newValue[0] : searchParams);
								searchName = 'len>';
							}
							if (searchName == 'len%3C' || searchName === 'len<') {
								newUrl = newUrl
									? `${newUrl}&${searchName}=${newValue.length > 0 ? newValue[1] : searchParams}`
									: `${newUrl}?${searchName}=${newValue.length > 0 ? newValue[1] : searchParams}`;
								array_data.push(newValue.length > 0 ? newValue[1] : searchParams);
								searchName = 'len<';
							}
							console.log('array_data', array_data)
							if (filterName)
								tempOld.lengthFilter = array_data.toString();
							else
								temp.lengthFilter = array_data.toString();

							this.setState({ rangeSelectedValue: array_data.toString() })

							console.log('newUrl***', newUrl)
						}
					}
					else if (!isFilter) {
						let newParams =
							tempOld && tempOld[searchName]
								? tempOld[searchName].join(",")
								: "";
						newParams = newParams.split(" ").join("-");
						if (newParams) {
							newUrl = newUrl
								? `${newUrl}&${searchName}=${newParams}`
								: `${newUrl}?${searchName}=${newParams}`;
						}
					}
				});
			}
		}

		if (filterName) {
			if (
				searchNameArr &&
				searchNameArr.indexOf(filterName) > -1 &&
				isFilter === "filter"
			) {
				console.log('isfilter')
				let newParams =
					tempOld && tempOld[filterName] ? tempOld[filterName].join(",") : "";
				newParams = newParams.split(" ").join("-");
				if (newParams) {
					newUrl = newUrl
						? `${newUrl}&${filterName}=${newParams}`
						: `${newUrl}?${filterName}=${newParams}`;
				}

			}
			else {
				console.log('searchNameArr', searchNameArr)
				if (filterName == 'lengthFilter') {
					var newValue = this.state.selected_filter['lengthFilter'] ? this.state.selected_filter['lengthFilter'].split(',') : [];
					console.log('newValue', newValue)

					if (searchNameArr && newValue.length &&
						(searchNameArr.indexOf('len>') == -1 && searchNameArr.indexOf('len<') == -1 && searchNameArr.indexOf('len%3E') == -1 && searchNameArr.indexOf('len%3C') == -1)) {
						console.log('if-searchNameArr', newUrl)
						newUrl = newUrl
							? `${newUrl}&len>=${newValue[0]}&len<=${newValue[1]}`
							: `${newUrl}?len>=${newValue[0]}&len<=${newValue[1]}`;
					} else if (!searchNameArr && newValue.length) {
						console.log('else-searchNameArr', newUrl)
						newUrl = newUrl
							? `${newUrl}&len>=${newValue[0]}&len<=${newValue[1]}`
							: `${newUrl}?len>=${newValue[0]}&len<=${newValue[1]}`;
					}
				} else if (filterName != 'lengthFilter') {
					console.log('else isfilter')
					let newParams =
						tempOld && tempOld[filterName] ? tempOld[filterName].join(",") : "";
					newParams = newParams.split(" ").join("-");
					if (newParams) {
						newUrl = newUrl
							? `${newUrl}&${filterName}=${newParams}`
							: `${newUrl}?${filterName}=${newParams}`;
					}
				}
			}
		} else if (isSort) {
			if (
				searchNameArr &&
				searchNameArr.indexOf('sortby') < 0 &&
				isSort
			) {
				console.log('indexofissort', searchNameArr.indexOf('sortby'));
				console.log('if issort', isSort)
				//newUrl = existingSearchData;
				var newParams = isSort.split(" ").join("-");
				newUrl = newUrl
					? `${newUrl}&sortby=${newParams}`
					: `${newUrl}?sortby=${newParams}`;
			} else if (!searchNameArr) {
				//console.log('else indexofissort', searchNameArr.indexOf('sortby'));

				var newParams = isSort.split(" ").join("-");
				newUrl = newUrl
					? `${newUrl}&sortby=${newParams}`
					: `${newUrl}?sortby=${newParams}`;
			}
		} else {
			console.log('else islenghtfilter', existingSearchData)
			newUrl = existingSearchData;
		}
		var url = this.props.history.location.pathname + newUrl;
		this.props.history.push(url);
		console.log('sortbyOld', url)
		this.setState(
			{ sort_filter: isSort ? isSort : (sortbyOld ? sortbyOld : 'Duration'), selected_filter: filterName ? tempOld : temp, offset: 0 },
			function () {
				this.getOnDemandList();
			}
		);
	}
	searchFucntion() {
		this.props.clearOndemandList();
		this.setState({ sort_filter: "", offset: 0, ondemandList: [], all_levels: [], all_tags: [], }, function () {
			ReactGA.event({
				category: "On Demand Video List",
				action: "Searched ",
				label: this.state.search_data,
			})
			this.getOnDemandList();
		});
	}
	checkFilterEmpty(dataObj) {
		var return_obj = dataObj;
		if (Object.keys(dataObj).length > 0 && dataObj.constructor === Object) {
			if (
				dataObj.lengthFilter.length <= 0 &&
				dataObj.videoType.length <= 0 &&
				dataObj.equipment.length <= 0 &&
				dataObj.level.length <= 0 &&
				dataObj.benefit.length <= 0 &&
				dataObj.discipline.length <= 0 &&
				dataObj.instructor.length <= 0
			) {
				return_obj = {};
				this.setState({ isInitFilter: true })
			}
		}
		return return_obj;
	}
	afterSaveCMS() {
		this.sortByFunction("Newest first");
		/* this.setState({ sort_filter: "Newest-first" }, function () {
		  this.getOnDemandList();
		}); */
	}
	getInitialAllFilters() {
		var typeFilter = commonService.replaceChar(this.state.typeFilter, false);
		this.setState({ isInitFilter: false })

		this.props.getAllFilters(typeFilter).then(
			response => {
				if (response) {
					this.setState({
						available_filter: response.availableFilters
							? response.availableFilters
							: this.state.available_filter,
						init_available_filter: response.availableFilters
					});
					this.setState({ isInitFilter: true });
				} else {
					this.setState({ isInitFilter: false })
				}
			}, error => {
				this.setState({ isInitFilter: false })
			}
		)
	}
	getQuickLinks() {
		//var condition = this.props.params.condition.replace('-', ' ')
		var condition = commonService.replaceChar(this.props.params.condition, true);
		this.props.getQuickLinks(condition).then(
			response => {
				if (response.data) {
					this.setState({ quickLinks: JSON.parse(response.data) });
					console.log('quickLinks', this.state.quickLinks)

				} else {
					this.setState({ quickLinks: [] })
				}
			}, error => {
				this.setState({ quickLinks: [] })
			}
		)
	}
	getOnDemandList(isFull = false) {
		this.setState({ loader: true, ondemandList: [], all_levels: [], all_tags: [], offset: this.props.isGoback ? this.props.offsetFull : this.state.offset });
		var dataObj = {
			isFullRecord: (this.props.isGoback || isFull) ? this.props.offsetFull : 0,
			offset: this.props.isGoback ? this.props.offsetFull : this.state.offset,
			limit: constand.ONDEMAND_LIST_CNT,
			sortby: this.state.sort_filter,
			keywords: this.state.search_data,
			isDraft: this.state.isDraft,
			filters: this.checkFilterEmpty(this.state.selected_filter)
		};
		var typeFilter = commonService.replaceChar(this.state.typeFilter, true); //this.state.typeFilter.replace(/-/g, " ");
		this.props.ondemandList(dataObj, typeFilter).then(
			responseData => {
				//this.props.setGoback(false)

				if (responseData) {
					var response = responseData.data;
					console.log('this.props.workout_list_tags', Object.keys(this.checkFilterEmpty(this.state.selected_filter)).length === 0)
					this.setState({
						ondemandList: this.props.workout_list,
						list_count: response.count,
						// available_filter: this.state.isInitFilter ? this.state.init_available_filter : (response.list.availableFilters ? response.list.availableFilters : this.state.available_filter),
						available_filter: this.state.isInitFilter ? this.state.init_available_filter : (Object.keys(this.checkFilterEmpty(this.state.selected_filter)).length === 0 ? this.state.available_filter : response.list.availableFilters),
						selected_filter: this.state.selected_filter, //response.list.selectedFilters ? response.list.selectedFilters: this.state.selected_filter
						lenthFilter_max: (response.list.lengthFilter && response.list.lengthFilter.length > 1) ? parseInt(response.list.lengthFilter[1]) : this.state.lenthFilter_max,
						all_tags: Object.keys(this.checkFilterEmpty(this.state.selected_filter)).length > 0 ? response.list.tags : this.props.workout_list_tags, //(response.list.tags) ? response.list.tags : [],
						all_levels: Object.keys(this.checkFilterEmpty(this.state.selected_filter)).length > 0 ? response.list.tags : this.props.workout_list_level, //(response.list.levelTags) ? response.list.levelTags : []
						loader: false, isInitFilter: false
					});
					//this.props.stop_loader();
				} else {
					this.setState({ ondemandList: [], all_levels: [], all_tags: [], list_count: 0, loader: false })
				}
			},
			error => {
				this.setState({ ondemandList: [], all_levels: [], all_tags: [], list_count: 0, loader: false })
				//this.props.stop_loader();
				//toast.error(error);
			}
		);
	}
	rangeChangeFunction(value) {
		if (value) {
			this.props.clearOndemandList();
			var temp = { ...this.state.selected_filter };
			if (Object.keys(temp).length === 0 && temp.constructor === Object) {
				temp = {
					condition: [],
					lengthFilter: "",
					videoType: [],
					level: [],
					benefit: [],
					discipline: [],
					equipment: [],
					instructor: []
				};
			}
			var array_data = [value.min, value.max];
			temp.lengthFilter = array_data.toString();
			/* var url = this.props.history.location.pathname + '?len>=' + value.min + '&len<=' + value.max;
			this.props.history.push(url); */
			this.setState({ selected_filter: temp, ondemandList: [], all_levels: [], all_tags: [], offset: 0 }, () => { this.onHeadeUrlChange('filter', 'lengthFilter'); });
		}
	}
	handleChangeRangeSelector = (value) => {
		this.setState({ rangeSelectedValue: value.min + ',' + value.max })
	}
	/**
	 * To display selected item
	 */
	renderSelectedFilter() {
		let value = [];
		this.state.filterNames.map((item, key) => {
			if (
				this.state.selected_filter &&
				this.state.selected_filter[item] &&
				this.state.selected_filter[item].length > 0
			) {
				if (item !== "lengthFilter") {
					this.state.selected_filter[item].map((val, index) =>
						value.push(
							<div
								key={"filter_rm_" + index + key}
								onClick={() => {
									this.removeFilterItem(item, val);
								}}
							>
								<span className="pointer"> x </span>
								<span className="capitalize_text pointer">{val}</span>
							</div>
						)
					);
				} else {
					let leng = this.state.selected_filter[item].split(",");
					console.log('lengvalue', leng)
					value.push(
						<div
							key={"filter_rm_" + key}
							onClick={() => {
								this.removeFilterItem('lengthFilter', '');
								//this.removeLengthFilter(item, this.state.selected_filter[item]);
							}}
						>
							<span className="pointer"> x </span>
							<span className="capitalize_text pointer">
								Class Length: {leng[0] + "-" + leng[1]} mins
							</span>
						</div>
					);
				}
			}
		});
		return value;
	}
	/**
	 * to remove selected filter item
	 * @param {*} item
	 * @param {*} val
	 */
	removeFilterItem(item, val) {
		this.filterFunction(item, val);
	}
	removeLengthFilter(name) {
		var temp = { ...this.state.selected_filter };
		temp[name] = "";
		this.setState({ selected_filter: temp, offset: 0 }, function () {
			this.getOnDemandList();
		});
	}
	/**
	 * on enter search
	 * @param {*} e
	 */
	searchBarEnter(e) {
		if (e.key === "Enter") {
			this.searchFucntion();
		}
	}
	getOnDemandDetail(workoutId) {
		this.props.ondemandDetail(workoutId, this.props.params.type).then(
			response => {
				this.props.ondemandCMSModelOpen({ open: true, type: 'edit' })
			}, error => {
				console.log('err', error)
			});
	}
	toggleHover = (key) => {
		var tempHover = this.state.hover;
		if (tempHover[key])
			tempHover[key] = !tempHover[key];
		else
			tempHover[key] = true;

		this.setState({ hover: tempHover })
	}
	render() {
		const ONDEMAND_SORT_FILTERLIST = [...constand.ONDEMAND_SORT_FILTERLIST];
		let authData = JSON.parse(localStorage.getItem('userDetails')) || this.props.logged_userData;

		return (
			<React.Fragment>
				<div className="py-4 active demand-list">
					<Helmet>
						<title>{constand.ONDEMAND_TITLE}{this.state.typeFilter}{constand.BEAM}</title>
						<meta property="og:title" content={constand.ONDEMAND_TITLE + this.state.typeFilter + constand.BEAM} />
						<meta property="og:description" content={constand.ONDEMAND_DESC} />
						<meta property="og:image" content={constand.ONDEMAND_PAGE_IMAGE} />
						<meta property="og:url" content={window.location.href} />
						<meta name="twitter:card" content="summary_large_image" />
						<meta property="og:site_name" content="Beam" />
						<meta name="twitter:image:alt" content={constand.ONDEMAND_PAGE_IMAGE_ALT} />
					</Helmet>
					<AdminBanner condition={this.props.params.condition} />
					<div className="container-fluid mx-auto w-95 p-0">
						<div className="row">
							<div className="filter-sm-section col-md-12 m-t-10 m-b-10 d-block d-sm-block d-md-none d-lg-none p-0">
								<div className="">
									<OndemandSearchComponent search_data={this.state.search_data}
										searchBarEnter={this.searchBarEnter.bind(this)}
										handleChange={this.handleChange}
										searchFucntion={this.searchFucntion}
										loader={this.state.loader}
										isMobileView={true} />

									<div className="col-12 col-sm-12 text-rightp-r-0 p-0">
										{!this.state.is_filter_clicked && !this.state.loader && this.state.ondemandList.length > 0 && (
											<button type="button"

												className="btn btn-purple-inverse button-filter close-btn  font-medium font-14 pointer"
												onClick={this.filterClickUpdate}
											>
												Filter
											</button>
										)}

										{this.state.is_filter_clicked && (
											<span
												className="btn btn-purple close-btn  font-medium font-14 pointer"
												onClick={this.filterClickUpdate}
											>
												Close
											</span>
										)}
									</div>
									<div className="col-md-12 col-sm-12">
										<SortByComponent sort_filter={this.state.sort_filter} sortByFunction={this.sortByFunction} />
									</div>
									{!this.state.loader && this.state.ondemandList && this.state.ondemandList.length > 0 && this.state.quickLinks && this.state.quickLinks.length > 0 &&
										<div className="filter-section col-md-12 m-t-10 m-b-30 p-0 text-center">
											<div className="row ">
												<div className="col-md-12">
													<p className="font-18 font-qbold">What type of activity would you like to do today?</p>
												</div>
												<div className="col-md-12 mx-auto">
													{this.state.quickLinks && this.state.quickLinks.map((item, key) => {
														return (
															<button className="btn btn-quicklink m-r-10 m-t-5 m-b-5" style={!this.state.hover[key] ? { 'background-color': item.colour, 'color': item.textColour } : { 'background-color': item.hoverColour, 'color': item.textHoverColour }} onClick={() => {
																ReactGA.event({
																	category: "On Demand Video List",
																	action: "Clicked Quick Link",
																	label: item.name
																})

																this.props.clearOndemandList();
																var url = this.props.history.location.pathname + '?' + item.link;
																this.props.history.push(url);
																this.onHeadeUrlChange();
															}}
																onMouseEnter={() => this.toggleHover(key)}
																onMouseLeave={() => this.toggleHover(key)}
															>{item.name}</button>
														)
													})
													}
												</div>
											</div>
										</div>
									}
								</div>
							</div>
							<div className="filter-section col-md-12 m-t-10 m-b-10 d-none d-sm-none d-md-block d-lg-block p-0">
								<div className="row">
									<div className="col-md-2 col-sm-2">
										<SortByComponent sort_filter={this.state.sort_filter} sortByFunction={this.sortByFunction} />
									</div>
									<div className="col-md-8 col-sm-8">
										<OndemandSearchComponent search_data={this.state.search_data}
											searchBarEnter={this.searchBarEnter.bind(this)}
											handleChange={this.handleChange}
											searchFucntion={this.searchFucntion}
											loader={this.state.loader}
											isMobileView={false} />
									</div>
									<div className="col-md-2 col-sm-2 text-right">
										{!this.state.is_filter_open && !this.state.loader && this.state.ondemandList.length > 0 && (
											<button type="button"
												className="btn btn-purple-inverse button-filter close-btn  font-medium font-14 pointer"
												onClick={() => this.setState({ is_filter_open: true })}
											>
												Filter
											</button>
										)}
										{this.state.is_filter_open && (
											<span
												className="btn btn-purple close-btn  font-medium font-14 pointer"
												onClick={() => this.setState({ is_filter_open: false })}
											>
												Close
											</span>
										)}
									</div>
									{this.state.selected_filter &&
										this.state.filterNames &&
										!this.state.is_filter_open && (
											<div className="font-14 orangefont filter-select w-100 m-t-20 m-b-20 font-book text-center">
												{this.renderSelectedFilter()}
											</div>
										)}

								</div>
							</div>


							<FilterComponent
								is_filter_open={this.state.is_filter_open}
								is_filter_clicked={this.state.is_filter_clicked}
								rangeSelectedValue={this.state.rangeSelectedValue}
								rangeChangeFunction={this.rangeChangeFunction}
								handleChangeRangeSelector={this.handleChangeRangeSelector}
								available_filter={this.state.available_filter}
								selected_filter={this.state.selected_filter}
								filterFunction={this.filterFunction}
							/>
							{this.props.is_auth && this.props.is_create_mode &&
								<div className="col-md-12 p-0">
									<div className="row ">
										<div className="offset-6 col-md-3 text-right">
											<button
												disabled={this.state.loader}
												onClick={() => { this.DraftData(1) }}
												className={"btn m-b-40 m-r-10 font-book p-r-30 p-l-30 w-100 " + (this.state.isDraft ? "btn-purple" : "btn-purple-inverse")}>Draft
											</button>
										</div>
										<div className="col-md-3 text-right">
											<button
												disabled={this.state.loader}
												onClick={() => { this.DraftData(0) }}
												className={"btn m-b-40 m-r-10 font-book p-r-30 p-l-30 w-100 " + (!this.state.isDraft ? "btn-darkblue" : "btn-darkblue-inverse")}>Live
											</button>
										</div>
									</div>
								</div>
							}
							{!this.state.loader && this.state.ondemandList && this.state.ondemandList.length > 0 && this.state.quickLinks && this.state.quickLinks.length > 0 &&
								<div className="filter-section col-md-12 m-t-10 m-b-30 d-none d-sm-none d-md-block d-lg-block p-0 text-center">
									<div className="row ">
										<div className="col-md-12">
											<p className="font-24 font-qbold">What type of activity would you like to do today?</p>
										</div>
										<div className="col-md-12 mx-auto">
											{this.state.quickLinks && this.state.quickLinks.map((item, key) => {
												return (
													<button className="btn btn-quicklink m-r-10 m-t-5 m-b-5" style={!this.state.hover[key] ? { 'background-color': item.colour, 'color': item.textColour } : { 'background-color': item.hoverColour, 'color': item.textHoverColour }} onClick={() => {
														this.props.clearOndemandList();
														var url = this.props.history.location.pathname + '?' + item.link;
														//  window.location.href=url;
														this.props.history.push(url);
														this.onHeadeUrlChange();
														if (item.link.includes('len')) {
															var lenFilterValue = item.link.split('&');
															var temp = { ...this.state.selected_filter };
															var array_data = [lenFilterValue[0].replace('len>=', ''), lenFilterValue[1].replace('len<=', '')];
															temp.lengthFilter = array_data.toString();
															this.setState({ selected_filter: temp, rangeSelectedValue: array_data.toString() })

														}
														/* 
														var filterValue = item.link.split('=');
														this.filterFunction(filterValue[0], filterValue[1]) */
													}}
														onMouseEnter={() => this.toggleHover(key)}
														onMouseLeave={() => this.toggleHover(key)}
													>{item.name}</button>
												)
											})
											}
										</div>
									</div>
								</div>
							}
							<div className="col-sm-12 four_grid pr-0">
								<div className="row">
									{this.props.is_auth && this.props.is_create_mode &&
										<div
											className="col-lg-4 col-md-6 col-sm-12 mb-4 p-l-5"
										>
											<div className="card h-100" >
												<div onClick={((e) => this.handlePosition(e))}>
													<div
														className="position-relative"
													>
														<ImageTag ref={node => { this.wrapperRef = node; }}
															className="card-img-top img-fluid"
															src={
																constand.WEB_IMAGES + "ondemand-placeholder.png"
															}
														/>

													</div>
												</div>
												<div className="card-body">
													<div className="w-100 float-left m-b-10">
														<div className="col-md-12 col-lg-12 col-sm-12 float-left p-0">
															<h3 className="black-txt font-16 font-semibold capitalize_text float-left w-75">
																<TextWrap text='New On Demand Class' />
															</h3>
															<div className="bookmark-left float-right text-right w-25">
															</div>
															<div className="bookmark-left m-l-10 float-left"></div>
														</div>
													</div>
													<div className="w-100 float-left">
														<div className="col-12 float-left m-b-10 p-0 font-medium">
															<p className="float-left font-16 black-txt font-qregular">
																Click the plus sign to create a new On Demand Class!
															</p>
															{!authData.isStudyLeader &&
																<p className="float-left font-16 black-txt font-qregular">
																	You will need...
																</p>
															}
														</div>
														{!authData.isStudyLeader &&

															<div className="col-11 float-left p-0">
																<div className="font-medium w-100">
																	<ul className="col-md-12 col-sm-12 float-left black-txt">
																		<li><span className="w-40 font-16 font-qregular float-left">
																			Link to ondemand video
																		</span></li>
																		<li><span className="w-40 font-16 font-qregular float-left">
																			Class thumbnail image
																		</span></li>
																	</ul>

																</div>
															</div>
														}
														{this.props.is_auth && this.props.is_create_mode &&
															<div className={"col-1 float-left p-0 pl-2 pointer " + (authData.isStudyLeader ? 'offset-11' : 'top-20')} onClick={() => { this.props.ondemandCMSModelOpen({ open: true, type: 'add' }); this.props.clearOndemandDetail() }}>
																<img src={constand.WEB_IMAGES + "add-plus.png"} />
															</div>
														}
													</div>
												</div>
											</div>
										</div>
									}

									{this.state.ondemandList.map((item, key) => {
										return (
											<div
												key={key}
												className="col-lg-4 col-md-6 col-sm-12 mb-4 p-l-5"
											>
												<div className="card h-100" >
													<div onClick={((e) => this.handlePosition(e))} className="position-relative ">
														{item.no_rooms > 0 && <span className="position-absolute vid_time workout-overlay">
															<Link
																to={"/detail/" + item.id + '/' + this.props.params.condition}
																className="position-relative text-decoration-none"
																onClick={() => { this.props.pushHistory(this.props.history.location.pathname) }}
															>
																<h4 class="orange_pos_text">Completed {item.no_rooms} times</h4>
															</Link>
														</span>
														}
														<Link
															to={"/detail/" + item.id + '/' + this.props.params.condition}
															className="position-relative"
															onClick={() => { this.props.pushHistory(this.props.history.location.pathname) }}
														>
															<ImageTag ref={node => { this.wrapperRef = node; }}
																className="card-img-top img-fluid"
																src={
																	constand.WORKOUT_IMG_PATH +
																	item.id +
																	"-img.png"
																}
																thumb={constand.WEB_IMAGES + "ondemand-placeholder.png"}
															/>
															{!item.isUploaded &&
																<div className="img-fluid play-img white-txt font-bold font-30 available-soon listing-page">Available soon...</div>
															}
															<span className="position-absolute vid_time">
																<span>{item.length} mins</span>
															</span>
														</Link>
													</div>
													<div className="card-body">
														<div className="w-100 float-left m-b-10">
															<div className="col-md-12 col-lg-12 col-sm-12 float-left p-0">
																<h3 className="black-txt font-16 font-semibold capitalize_text float-left w-75">
																	<TextWrap text={item.title} limit={constand.ONDEMAND_WORD_LIMIT} />
																</h3>
																<div className="bookmark-left float-right text-right w-25">
																	<WorkoutScheduleComponent
																		from="ondemand"
																		ondemand_data={item}
																		location={this.props.location}
																		history={this.props.history}
																	/>
																	<b className="m-l-10">
																		<WorkoutSaveComponent
																			className="m-l-10"
																			page="ondemand_list"
																			workoutData={item}
																		/>
																	</b>
																</div>
																<div className="bookmark-left m-l-10 float-left"></div>
															</div>
														</div>
														<div className="w-100 float-left">
															<div className="col-12 float-left m-b-10 p-0">
																<div className="left-image leftwidth-set p-0 border-0 float-left">
																	<ImageTag
																		className="img-fluid rounded-circle"
																		src={
																			item.Instructor && item.Instructor.img
																				? constand.USER_IMAGE_PATH +
																				item.Instructor.img
																				: constand.WEB_IMAGES + "instructor-placeholder.png"
																		}
																	/>
																</div>
																<div className="row">
																	{item.Instructor.hasProfile &&
																		<a className="float-left font-16 black-txt font-qregular p-l-10 w-80 m-b-0" href={'/instructor/' + item.Instructor.id + '/' + this.state.typeFilter} >
																			{item.Instructor.User &&
																				<p className="font-semibold font-18 m-b-0"> {item.Instructor.User.name +
																					" " +
																					item.Instructor.User.lastName}
																				</p>
																			}
																		</a>
																	}
																	{!item.Instructor.hasProfile &&
																		<p className="float-left font-16 black-txt font-qregular p-l-10 w-80 m-b-0" >
																			{item.Instructor.User &&
																				<p className="font-semibold font-18 m-b-0">
																					{item.Instructor.User.name +
																						" " +
																						item.Instructor.User.lastName}
																				</p>
																			}
																		</p>
																	}
																	{item.Instructor.title && <p className="font-qmedium silver-txt font-16 m-b-0 float-left m-l-10">{item.Instructor.title}</p>}
																</div>
															</div>
															<div className="col-11 float-left p-0">
																<div className="font-medium w-100">
																	<div className="col-md-12 col-sm-12 float-left p-0">
																		<span className="w-40  font-16 black-txt font-qbold float-left">
																			Discipline:
																		</span>
																		<span className=" orangefont w-60 float-left font-16 font-qregular p-l-5 capitalize_text">
																			{commonService.returnListOfTag(
																				"discipline", this.state.all_tags, item.id
																			)}
																		</span>
																	</div>
																	<div className="col-md-12 col-sm-12 float-left p-0">
																		<span className="w-40  font-16 black-txt font-qbold float-left">
																			Level:
																		</span>

																		<span className="font-16 font-qregular capitalize_text orangefont w-60 float-left p-l-5 capitalize_text">
																			{commonService.returnListOfTag(
																				"level", this.state.all_tags, item.id
																			)}
																		</span>
																	</div>
																	{/* <div className="col-md-12 col-sm-12 float-left p-0">
                              <span className="w-40 float-left  font-16 black-txt font-qregular">
                                Language:
                              </span>
                              <span className="w-60 float-left">
                                {" "}
                                <img
                                  className="img-fluid p-l-5"
                                  src="/images/flag.png"
                                  alt=""
                                />
                              </span>
                            </div> */}
																</div>
															</div>
															{this.props.is_auth && this.props.is_create_mode &&
																<div className="col-1 float-left top-20 p-0 pl-2 pointer" onClick={() => { this.getOnDemandDetail(item.id) }}><img src={constand.WEB_IMAGES + "edit-pencil.png"} /></div>
															}
														</div>
													</div>
												</div>
											</div>
										);
									})}
									<div className="text-center w-100">
										{(this.state.loader) && (<AnimateLoaderComponent />)}
									</div>
									{((this.state.ondemandList.length > 0) && (this.state.ondemandList.length < this.state.list_count)) && (
										<div className="col-md-12 col-lg-12 col-sm-12 text-center float-left">
											<button
												disabled={
													this.state.loader
												}
												onClick={() => { this.incrementShowmoreCnt('') }}
												className="btn btn-orange m-t-40 m-b-40 font-book"
											>
												Show more on-demand videos
											</button>
										</div>
									)}
									{((this.state.ondemandList.length > 0) && (this.state.ondemandList.length < this.state.list_count)) && (
										<div className="col-md-12 col-lg-12 col-sm-12 text-center float-left">
											<button
												disabled={
													this.state.loader
												}
												onClick={() => { this.incrementShowmoreCnt('all') }}
												className="btn btn-purple m-b-40 font-book p-r-30 p-l-30"
											>
												Show all
											</button>
										</div>
									)}


									{!this.state.ondemandList ||
										(this.state.ondemandList.length === constand.CONSTZERO && (
											<div className="text-center w-100">
												{(!this.state.loader) ? ("Watch this space! On-demand videos for this health condition are coming soon...") : ''}
											</div>
										))}


								</div>
							</div>
						</div>
					</div>
					{this.props.is_cms_model &&
						<WorkoutCMSComponent getList={this.afterSaveCMS} />
					}
				</div>
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	return {
		is_auth: state.auth.is_auth,
		workout_list: state.workout.workout_list,
		offsetFull: state.workout.offset,
		isGoback: state.workout.isGoback,
		currentPosition: state.workout.currentPosition,
		is_create_mode: state.header.is_create_mode,
		is_cms_model: state.workout.is_cms_model,
		workout_list_tags: state.workout.workout_list_tags,
		workout_list_level: state.workout.workout_list_level,

	};
};

const mapDispatchToProps = {
	ondemandList,
	clearOndemandList,
	start_loader,
	stop_loader,
	updateOffset,
	setGoback,
	setCurrentPosition,
	pushHistory,
	ondemandCMSModelOpen,
	ondemandDetail,
	clearOndemandDetail,
	getAllFilters,
	getQuickLinks
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(WorkoutsComponent);