Polymer('blog-list', {
  accessToken: "b3a68b5a67cc88c023c8baf88211c0101258f8b9",
  responseChanged: function(oldValue) {
    this.blogs = this.filterMarkDown(this.response);
  },
  selection: function(e){
    this.k = e.target.templateInstance.model.i;
    this.$.pages.selected = 1;
    var blog = e.target.templateInstance.model.blog;
    this.blogTitle = blog.description; 
    this.blogOwner = blog.owner.login;
    this.blogDate= blog.updated_at; 
    this.gistUrl = blog.url+"?access_token="+this.accessToken;
    this.content= "empty";
    this.$.gistAjax.go();
  },
  transitionend: function(){
    if (this.lastSelected) {
      this.lastSelected = null;
    }
  },
  back: function() {
    this.lastSelected = this.$.pages.selected;
    this.$.pages.selected = 0;
    this.content= "";
  },
  gistresponseChanged: function(e, detail){
    if(this.$.gistAjax.response != null){
      this.gist = this.$.gistAjax.response;
    }
    var files = this.gist.files;
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
