#!/usr/bin/nodejs
var Kmean=function(arr,k){
    this.arr=arr;
    this.means = null;
    this.round = 0;
    k=(k>arr.length)?arr.length:k;
    var m,pi,j,sum,d,l=arr.length;
    var means=this.means=[];
    var getDistance=this.getDistance;

    d=arr.map(function(p,i){
        sum=0;
        for(j=0;j<l;j++){
            sum+=getDistance(arr[j],p);
        }
        return {"i":i,"d":sum,"v":p};
    });
    d.sort(function(a,b){return b.d-a.d;});
    p=null;
    for(i=0;i<l;i++){
        if(p==d[i].v)
            continue;
        p=d[i].v;
        means.push(p);
        if(means.length>=k)break;
    }
    means.sort(function(a,b){return a-b;});
    console.log("init mean:");
    console.log(means);
    console.log();
}

Kmean.prototype.setMean=function(cluster){
    var means=this.means=[];
    var g,c,i,sum,l=cluster.length;
    for(i=0;i<l;i++){
        c=cluster[i];
        if(c.length==0)
            continue;
        g=c.map(function(a){return a});
        sum=g.reduce(function(a,b){return a+b;});
        means.push(sum/g.length);
    }
}

Kmean.prototype.getDistance=function(p,mean){
    return Math.abs(p-mean);
}

Kmean.prototype.genCluster = function(){
    var getDistance=this.getDistance;
    var cluster = [];
    var i,p,pi,m,min,d,arr=this.arr,means=this.means,k=this.means.length,l=this.arr.length;
    for(i=0;i<k;i++){
        cluster[i]=[];
    }

    for(pi=0;pi<l;pi++){
        p = arr[pi];
        m=0;min=getDistance(p,means[0]);
        for(i=1;i<k;i++){
            d=getDistance(p,means[i]);
            if(min>=d){
                min=d;
                m=i;   
            }
        }
        cluster[m].push(p);
    }
    return cluster;
}
Kmean.isSame=function(c0,c1){
    var k,i,g0,g1,p0,p1,pl,pi;
    k=c0.length;
    if(k!=c1.length)
        return false;
    for(i=0;i<k;i++){
        g0=c0[i];
        g1=c1[i];
        if(g0.length!=g1.length)
            return false;
        pl=g0.length;
        for(pi=0;pi<pl;pi++){
            if(g0[pi]!==g1[pi])
                return false;
        }
    }
    return true;
}

Kmean.getCluster=function(arr,k){
    var kmean=new Kmean(arr,k);
    var c0,c1=kmean.genCluster();
    var round=1;
    for(;;){
        round++;
        c0=c1;
        kmean.setMean(c0);
        c1=kmean.genCluster();
        if(!Kmean.isSame(c0,c1))
            continue;
        break;
    }
    c1.round=round;
    c1.means=kmean.means;
    c1.hist={};
    var i,g,pi=0,k=c1.length,l=arr.length;
    for(i=0;i<k;i++){
        g=c1[i];
        var floor=Math.ceil((pi)*100/l);
        var ceil=Math.ceil((pi+g.length)*100/l);
        pi+=g.length;
        g.sort(function(a,b){return a-b;});
        c1.hist[floor+"% ~ "+ceil+"%"]={min:g[0],max:g[g.length-1],mean:c1.means[i],count:g.length};
    }
    c1.k=k;
    return c1;
}

var arr=[];
for(var i=0;i<10;i++){
    arr.push(Math.floor(Math.random()*10));
}
//arr=[ 1, 0, 1, 0, 0, 2, 0, 1, 1, 2 ];
console.log("data arr:");
console.log(arr);
console.log();
var cluster=Kmean.getCluster(arr,6)
console.log("cluster:");
console.log(cluster);
