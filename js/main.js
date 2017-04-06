Backbone.Model.prototype.idAttribute = '_id';

// Backone model

var Task = Backbone.Model.extend({
	defaults: {
		title:'',
		content:'',
		date: '',
		category:''
	},
	url: "https://conradgolinski.github.io/menage_time/"
});

var Tasks = Backbone.Collection.extend({});

var tasks = new Tasks();

// for one task

var TaskView = Backbone.View.extend({
	model: new Task(),
	tagName:'div',
	initialize: function() {
		this.template = _.template($('.tasks-template').html());
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}

});


// for all tasks

var TasksView = Backbone.View.extend({
	model: new Tasks(),
	$el:$('div.view-collection'),
	initialize:function(){
		this.model.on('add',this.render,this);
		this.model.on('change',function(){
			setTimeout(function() {
				this.render();
			}, 30);
		},this);
		this.model.on('remove', this.render, this);
		this.model.fetch({
			success:function(res){
				_.each(res.toJSON(),function(item){
					console.log("success for : "+ item._id)
				});
			},
			error:function(){
				console.log("Error for get");
			}

		});
	},
	render:function(){

		this.$el.html('');
		_.each(this.model.toArray(),function(task){
			this.$el.append((new TaskView({model: task})).render().$el);
		});
		return this;
	}
});

$(document).ready(function(){
	$('#datetimepicker1').datetimepicker({format: 'DD-MM-YYYY HH:mm:ss'});

	$('button.add-task').on('click',function(){
		var task = new Task({
			title:$('input.title').val(),
			content:$('input.content').val(),
			date:$('input.date').val(),
			category:$('input.category').val()
		});
		title:$('input.title').val('');
		content:$('input.content').val('');
		date:$('input.date').val('');
		category:$('input.category').val('');
		tasks.add(task);

		task.save(null, {
			succes:function(res){
				console.log('Succesfully SAVED task with _id: '+ res.toJSON()._id);
			},
			error:function(){
				console.log('Failed SAVED task  ');
			
			}
		});
	});
});