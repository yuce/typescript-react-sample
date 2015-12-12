/// <reference path="typings/tsd.d.ts" />

import React = require('react');

interface CommentProps extends React.Props<any> {
	author: string;
	text: string;
}

class Comment extends React.Component<CommentProps, any> {
	render() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">{this.props.author}</h2>
				{this.props.text}
			</div>
		);
	}
}

var data: Array<CommentProps> = [
	{author: "Philip K. Dick", text: "Some comment", key: 1},
	{author: "Roman Polanski", text: "The Tenant", key: 2}
];

interface CommentBoxState {
	data: Array<any>;
}

interface CommentBoxProps extends React.Props<any> {
	url: string;
	pollInterval?: number;
}

class CommentBox extends React.Component<CommentBoxProps, CommentBoxState> {
	state: CommentBoxState = {data: []};

	componentDidMount() {
		this.loadComments();
		if (this.props.pollInterval) {
			setInterval(() => {
				this.loadComments();
			}, this.props.pollInterval);
		}
	}

	private loadComments() {
		let req = new XMLHttpRequest();
		let self = this;
		req.addEventListener('load', function(ev) {
			self.setState({data: JSON.parse(this.responseText)});
		});
		req.open('GET', this.props.url);
		req.send();
	}

	handleCommentSubmit = (comment: CommentProps) => {
		let comments = this.state.data;
		let newComments = comments.concat([comment]);
		this.setState({data: newComments});
		// console.log(`Submit Author: ${comment.author} Comment: ${comment.text}`);
		// let req = new XMLHttpRequest();
		// let self = this;
		// req.addEventListener('load', function(ev) {
		// 	self.setState({data: JSON.parse(this.responseText)});
		// });
		// req.open('POST', this.props.url);
		// req.send();
	}

	render() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.state.data}/>
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
			</div>
		);
	}
}

class CommentList extends React.Component<any, any> {
	// render() {
	// 	return (
	// 		<div className="commentList">
	// 			<Comment author="Pete Hunt">Some comment</Comment>
	// 			<Comment author="Jorawn Wlk">Another comment</Comment>
	// 		</div>
	// 	);
	// }

	render() {
		let commentNodes = this.props.data.map((comment: CommentProps) => {
			return (
				<Comment author={comment.author} text={comment.text} key={comment.key} />
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		)
	}
}

interface CommentFormProps extends React.Props<any> {
	onCommentSubmit(comment: CommentProps): void;
}

class CommentForm extends React.Component<CommentFormProps, any> {

	handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		let authorElem = React.findDOMNode(this.refs['author']) as HTMLInputElement;
		let author = authorElem.value.trim();
		let textElem = React.findDOMNode(this.refs['text']) as HTMLInputElement;
		let text = textElem.value.trim();
		if (!text || !author) {
			return;
		}
		console.log(`author: ${author}`);
		console.log(`text: ${text}`);

		this.props.onCommentSubmit({author: author, text: text});

		authorElem.value = '';
		textElem.value = '';
	}

	render() {
		return (
			<div className="commentForm">
				<form className="commentForm" onSubmit={this.handleSubmit}>
					<input type="text" placeholder="Your name..." ref="author" />
					<input type="text" placeholder="Your comment..." ref="text" />
					<input type="submit" value="Post" />
				</form>
			</div>
		)
	}
}


window.addEventListener('load', () => {
	// var x = <CommentBox data={data} />;
	var x = <CommentBox url="comments.json" pollInterval={0} />;
	React.render(x, document.getElementById('mount'));
});
