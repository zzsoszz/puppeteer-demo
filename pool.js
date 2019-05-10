
	var objectPool = (function(){
	  var _instance = null;
	  function Pool(options) {
	    this.objects=[];
	    this.size=options.size;
	    this.requireObject=function(){
	      if(this.objects.length>0){
	        return this.objects.shift();
	      }
	      return null;
	    }
	    this.returnObject=function(object){
	      this.objects.push(object);
	    }
	    this.init=function(){
	    	for(var i=0;i<this.size;i++){
	    		this.objects.push(options.createObject());
	    	}            
	    }
	    this.init();
	  }
	  return function(options){
	    if(!_instance) {
	      _instance = new Pool(options);
	    }
	    return _instance;
	  };
	})();

    var i=0;
	var pagePool=objectPool({
			size:2,
			createObject:function(){
              return {name:"hello",i:i++};
			}
	});
   var page1= pagePool.requireObject();
   var page2= pagePool.requireObject();
   pagePool.returnObject(page1);
   pagePool.returnObject(page2);
   page1= pagePool.requireObject();
   page2= pagePool.requireObject();
   console.log(page1);
   console.log(page2);






    
