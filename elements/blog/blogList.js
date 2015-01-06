Polymer('blog-list', {
  accessToken: "b3a68b5a67cc88c023c8baf88211c0101258f8b9",
  ready: function(){
      this.$.ajax.go();
  },
  responseChanged: function(oldValue) {
    this.blogs = this.filterMarkDown(this.response);
    if(this.route){
      this.loadGist();
    }
  },
  selection: function(e){
    this.k = e.target.templateInstance.model.i;
    this.route = this.k;
    this.loadGist();
    this.route = e.currentTarget.getAttribute('link');
  },
  loadGist: function(){
    this.gistUrl = this.blogs[this.route].url+"?access_token="+this.accessToken; 
    this.$.gistAjax.go();
  },
  buildBlogFromGist: function(gist){
    this.blogTitle = gist.description; 
    this.blogOwner = gist.owner.login;
    this.blogDate = gist.updated_at;
    this.blogContent = this.buildBlogContent(gist);
  },
  buildBlogContent: function(gist){
    var files = gist.files;
    var contentFile;
    for (var i in files) {
        if (files.hasOwnProperty(i) && typeof(i) !== 'function') {
            contentFile = files[i];
            break;
        }
    }
    if(contentFile.content != " "){
      this.content = markdown.toHTML(contentFile.content);
    }
    else{
      this.content = "This is a empty blog";
    }
    return this.content;
  },
  transitionend: function(){
    if (this.lastSelected) {
      this.lastSelected = null;
    }
  },
  back: function() {
    this.lastSelected = this.$.pages.selected;
    this.route = "";
    this.content= "";
  },
  gistresponseChanged: function(e, detail){
    if(this.$.gistAjax.response != null){
      this.gist = this.$.gistAjax.response;
    }
    this.buildBlogFromGist(this.gist);
  },
  filterMarkDown: function(blogs){
    this.filteredBlogs = [];
    for(var b in blogs){
      var files = blogs[b].files;
      var contentFile, fileExtension;
      for (var i in files) {
          if (files.hasOwnProperty(i) && typeof(i) !== 'function') {
              contentFile = files[i];
              break;
          }
      }
      fileExtension = contentFile.filename.split('.').pop();
      if(fileExtension == "md"){
        this.filteredBlogs.push(blogs[b]);
      }
    }
    return this.filteredBlogs;
  }

});
