/* esm.sh - esbuild bundle(fflate@0.8.1) denonext production */
var cn={},Qn=function(n,r,t,e,i){var a=new Worker(cn[r]||(cn[r]=URL.createObjectURL(new Blob([n+';addEventListener("error",function(e){e=e.error;postMessage({$e$:[e.message,e.code,e.stack]})})'],{type:"text/javascript"}))));return a.onmessage=function(o){var s=o.data,l=s.$e$;if(l){var f=new Error(l[0]);f.code=l[1],f.stack=l[2],i(f,null)}else i(null,s)},a.postMessage(t,e),a},U=Uint8Array,W=Uint16Array,Zr=Int32Array,mr=new U([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),xr=new U([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Cr=new U([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),An=function(n,r){for(var t=new W(31),e=0;e<31;++e)t[e]=r+=1<<n[e-1];for(var i=new Zr(t[30]),e=1;e<30;++e)for(var a=t[e];a<t[e+1];++a)i[a]=a-t[e]<<5|e;return{b:t,r:i}},Mn=An(mr,2),tn=Mn.b,kr=Mn.r;tn[28]=258,kr[258]=28;var Un=An(xr,0),Fn=Un.b,Qr=Un.r,Ir=new W(32768);for(I=0;I<32768;++I)nr=(I&43690)>>1|(I&21845)<<1,nr=(nr&52428)>>2|(nr&13107)<<2,nr=(nr&61680)>>4|(nr&3855)<<4,Ir[I]=((nr&65280)>>8|(nr&255)<<8)>>1;var nr,I,V=function(n,r,t){for(var e=n.length,i=0,a=new W(r);i<e;++i)n[i]&&++a[n[i]-1];var o=new W(r);for(i=1;i<r;++i)o[i]=o[i-1]+a[i-1]<<1;var s;if(t){s=new W(1<<r);var l=15-r;for(i=0;i<e;++i)if(n[i])for(var f=i<<4|n[i],u=r-n[i],h=o[n[i]-1]++<<u,v=h|(1<<u)-1;h<=v;++h)s[Ir[h]>>l]=f}else for(s=new W(e),i=0;i<e;++i)n[i]&&(s[i]=Ir[o[n[i]-1]++]>>15-n[i]);return s},tr=new U(288);for(I=0;I<144;++I)tr[I]=8;var I;for(I=144;I<256;++I)tr[I]=9;var I;for(I=256;I<280;++I)tr[I]=7;var I;for(I=280;I<288;++I)tr[I]=8;var I,yr=new U(32);for(I=0;I<32;++I)yr[I]=5;var I,Dn=V(tr,9,0),Sn=V(tr,9,1),Tn=V(yr,5,0),Cn=V(yr,5,1),$r=function(n){for(var r=n[0],t=1;t<n.length;++t)n[t]>r&&(r=n[t]);return r},Q=function(n,r,t){var e=r/8|0;return(n[e]|n[e+1]<<8)>>(r&7)&t},qr=function(n,r){var t=r/8|0;return(n[t]|n[t+1]<<8|n[t+2]<<16)>>(r&7)},zr=function(n){return(n+7)/8|0},X=function(n,r,t){return(r==null||r<0)&&(r=0),(t==null||t>n.length)&&(t=n.length),new U(n.subarray(r,t))},et={UnexpectedEOF:0,InvalidBlockType:1,InvalidLengthLiteral:2,InvalidDistance:3,StreamFinished:4,NoStreamHandler:5,InvalidHeader:6,NoCallback:7,InvalidUTF8:8,ExtraFieldTooLong:9,InvalidDate:10,FilenameTooLong:11,StreamFinishing:12,InvalidZipData:13,UnknownCompressionMethod:14},In=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],p=function(n,r,t){var e=new Error(r||In[n]);if(e.code=n,Error.captureStackTrace&&Error.captureStackTrace(e,p),!t)throw e;return e},Br=function(n,r,t,e){var i=n.length,a=e?e.length:0;if(!i||r.f&&!r.l)return t||new U(0);var o=!t,s=o||r.i!=2,l=r.i;o&&(t=new U(i*3));var f=function(Sr){var Tr=t.length;if(Sr>Tr){var cr=new U(Math.max(Tr*2,Sr));cr.set(t),t=cr}},u=r.f||0,h=r.p||0,v=r.b||0,M=r.l,m=r.d,z=r.m,c=r.n,x=i*8;do{if(!M){u=Q(n,h,1);var F=Q(n,h+1,3);if(h+=3,F)if(F==1)M=Sn,m=Cn,z=9,c=5;else if(F==2){var B=Q(n,h,31)+257,S=Q(n,h+10,15)+4,w=B+Q(n,h+5,31)+1;h+=14;for(var g=new U(w),D=new U(19),T=0;T<S;++T)D[Cr[T]]=Q(n,h+T*3,7);h+=S*3;for(var O=$r(D),H=(1<<O)-1,G=V(D,O,1),T=0;T<w;){var P=G[Q(n,h,H)];h+=P&15;var A=P>>4;if(A<16)g[T++]=A;else{var L=0,E=0;for(A==16?(E=3+Q(n,h,3),h+=2,L=g[T-1]):A==17?(E=3+Q(n,h,7),h+=3):A==18&&(E=11+Q(n,h,127),h+=7);E--;)g[T++]=L}}var N=g.subarray(0,B),k=g.subarray(B);z=$r(N),c=$r(k),M=V(N,z,1),m=V(k,c,1)}else p(1);else{var A=zr(h)+4,y=n[A-4]|n[A-3]<<8,Z=A+y;if(Z>i){l&&p(0);break}s&&f(v+y),t.set(n.subarray(A,Z),v),r.b=v+=y,r.p=h=Z*8,r.f=u;continue}if(h>x){l&&p(0);break}}s&&f(v+131072);for(var sr=(1<<z)-1,Y=(1<<c)-1,rr=h;;rr=h){var L=M[qr(n,h)&sr],j=L>>4;if(h+=L&15,h>x){l&&p(0);break}if(L||p(2),j<256)t[v++]=j;else if(j==256){rr=h,M=null;break}else{var J=j-254;if(j>264){var T=j-257,$=mr[T];J=Q(n,h,(1<<$)-1)+tn[T],h+=$}var d=m[qr(n,h)&Y],lr=d>>4;d||p(3),h+=d&15;var k=Fn[lr];if(lr>3){var $=xr[lr];k+=qr(n,h)&(1<<$)-1,h+=$}if(h>x){l&&p(0);break}s&&f(v+131072);var vr=v+J;if(v<k){var Or=a-k,Lr=Math.min(k,vr);for(Or+v<0&&p(3);v<Lr;++v)t[v]=e[Or+v]}for(;v<vr;++v)t[v]=t[v-k]}}r.l=M,r.p=rr,r.b=v,r.f=u,M&&(u=1,r.m=z,r.d=m,r.n=c)}while(!u);return v!=t.length&&o?X(t,0,v):t.subarray(0,v)},_=function(n,r,t){t<<=r&7;var e=r/8|0;n[e]|=t,n[e+1]|=t>>8},pr=function(n,r,t){t<<=r&7;var e=r/8|0;n[e]|=t,n[e+1]|=t>>8,n[e+2]|=t>>16},Hr=function(n,r){for(var t=[],e=0;e<n.length;++e)n[e]&&t.push({s:e,f:n[e]});var i=t.length,a=t.slice();if(!i)return{t:ir,l:0};if(i==1){var o=new U(t[0].s+1);return o[t[0].s]=1,{t:o,l:1}}t.sort(function(Z,B){return Z.f-B.f}),t.push({s:-1,f:25001});var s=t[0],l=t[1],f=0,u=1,h=2;for(t[0]={s:-1,f:s.f+l.f,l:s,r:l};u!=i-1;)s=t[t[f].f<t[h].f?f++:h++],l=t[f!=u&&t[f].f<t[h].f?f++:h++],t[u++]={s:-1,f:s.f+l.f,l:s,r:l};for(var v=a[0].s,e=1;e<i;++e)a[e].s>v&&(v=a[e].s);var M=new W(v+1),m=Nr(t[u-1],M,0);if(m>r){var e=0,z=0,c=m-r,x=1<<c;for(a.sort(function(B,S){return M[S.s]-M[B.s]||B.f-S.f});e<i;++e){var F=a[e].s;if(M[F]>r)z+=x-(1<<m-M[F]),M[F]=r;else break}for(z>>=c;z>0;){var A=a[e].s;M[A]<r?z-=1<<r-M[A]++-1:++e}for(;e>=0&&z;--e){var y=a[e].s;M[y]==r&&(--M[y],++z)}m=r}return{t:new U(M),l:m}},Nr=function(n,r,t){return n.s==-1?Math.max(Nr(n.l,r,t+1),Nr(n.r,r,t+1)):r[n.s]=t},Vr=function(n){for(var r=n.length;r&&!n[--r];);for(var t=new W(++r),e=0,i=n[0],a=1,o=function(l){t[e++]=l},s=1;s<=r;++s)if(n[s]==i&&s!=r)++a;else{if(!i&&a>2){for(;a>138;a-=138)o(32754);a>2&&(o(a>10?a-11<<5|28690:a-3<<5|12305),a=0)}else if(a>3){for(o(i),--a;a>6;a-=6)o(8304);a>2&&(o(a-3<<5|8208),a=0)}for(;a--;)o(i);a=1,i=n[s]}return{c:t.subarray(0,e),n:r}},gr=function(n,r){for(var t=0,e=0;e<r.length;++e)t+=n[e]*r[e];return t},en=function(n,r,t){var e=t.length,i=zr(r+2);n[i]=e&255,n[i+1]=e>>8,n[i+2]=n[i]^255,n[i+3]=n[i+1]^255;for(var a=0;a<e;++a)n[i+a+4]=t[a];return(i+4+e)*8},Xr=function(n,r,t,e,i,a,o,s,l,f,u){_(r,u++,t),++i[256];for(var h=Hr(i,15),v=h.t,M=h.l,m=Hr(a,15),z=m.t,c=m.l,x=Vr(v),F=x.c,A=x.n,y=Vr(z),Z=y.c,B=y.n,S=new W(19),w=0;w<F.length;++w)++S[F[w]&31];for(var w=0;w<Z.length;++w)++S[Z[w]&31];for(var g=Hr(S,7),D=g.t,T=g.l,O=19;O>4&&!D[Cr[O-1]];--O);var H=f+5<<3,G=gr(i,tr)+gr(a,yr)+o,P=gr(i,v)+gr(a,z)+o+14+3*O+gr(S,D)+2*S[16]+3*S[17]+7*S[18];if(l>=0&&H<=G&&H<=P)return en(r,u,n.subarray(l,l+f));var L,E,N,k;if(_(r,u,1+(P<G)),u+=2,P<G){L=V(v,M,0),E=v,N=V(z,c,0),k=z;var sr=V(D,T,0);_(r,u,A-257),_(r,u+5,B-1),_(r,u+10,O-4),u+=14;for(var w=0;w<O;++w)_(r,u+3*w,D[Cr[w]]);u+=3*O;for(var Y=[F,Z],rr=0;rr<2;++rr)for(var j=Y[rr],w=0;w<j.length;++w){var J=j[w]&31;_(r,u,sr[J]),u+=D[J],J>15&&(_(r,u,j[w]>>5&127),u+=j[w]>>12)}}else L=Dn,E=tr,N=Tn,k=yr;for(var w=0;w<s;++w){var $=e[w];if($>255){var J=$>>18&31;pr(r,u,L[J+257]),u+=E[J+257],J>7&&(_(r,u,$>>23&31),u+=mr[J]);var d=$&31;pr(r,u,N[d]),u+=k[d],d>3&&(pr(r,u,$>>5&8191),u+=xr[d])}else pr(r,u,L[$]),u+=E[$]}return pr(r,u,L[256]),u+E[256]},Zn=new Zr([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),ir=new U(0),Bn=function(n,r,t,e,i,a){var o=a.z||n.length,s=new U(e+o+5*(1+Math.ceil(o/7e3))+i),l=s.subarray(e,s.length-i),f=a.l,u=(a.r||0)&7;if(r){u&&(l[0]=a.r>>3);for(var h=Zn[r-1],v=h>>13,M=h&8191,m=(1<<t)-1,z=a.p||new W(32768),c=a.h||new W(m+1),x=Math.ceil(t/3),F=2*x,A=function(Jr){return(n[Jr]^n[Jr+1]<<x^n[Jr+2]<<F)&m},y=new Zr(25e3),Z=new W(288),B=new W(32),S=0,w=0,g=a.i||0,D=0,T=a.w||0,O=0;g+2<o;++g){var H=A(g),G=g&32767,P=c[H];if(z[G]=P,c[H]=G,T<=g){var L=o-g;if((S>7e3||D>24576)&&(L>423||!f)){u=Xr(n,l,0,y,Z,B,w,D,O,g-O,u),D=S=w=0,O=g;for(var E=0;E<286;++E)Z[E]=0;for(var E=0;E<30;++E)B[E]=0}var N=2,k=0,sr=M,Y=G-P&32767;if(L>2&&H==A(g-Y))for(var rr=Math.min(v,L)-1,j=Math.min(32767,g),J=Math.min(258,L);Y<=j&&--sr&&G!=P;){if(n[g+N]==n[g+N-Y]){for(var $=0;$<J&&n[g+$]==n[g+$-Y];++$);if($>N){if(N=$,k=Y,$>rr)break;for(var d=Math.min(Y,$-2),lr=0,E=0;E<d;++E){var vr=g-Y+E&32767,Or=z[vr],Lr=vr-Or&32767;Lr>lr&&(lr=Lr,P=vr)}}}G=P,P=z[G],Y+=G-P&32767}if(k){y[D++]=268435456|kr[N]<<18|Qr[k];var Sr=kr[N]&31,Tr=Qr[k]&31;w+=mr[Sr]+xr[Tr],++Z[257+Sr],++B[Tr],T=g+N,++S}else y[D++]=n[g],++Z[n[g]]}}for(g=Math.max(g,T);g<o;++g)y[D++]=n[g],++Z[n[g]];u=Xr(n,l,f,y,Z,B,w,D,O,g-O,u),f||(a.r=u&7|l[u/8|0]<<3,u-=7,a.h=c,a.p=z,a.i=g,a.w=T)}else{for(var g=a.w||0;g<o+f;g+=65535){var cr=g+65535;cr>=o&&(l[u/8|0]=f,cr=o),u=en(l,u+1,n.subarray(g,cr))}a.i=o}return X(s,0,e+zr(u)+i)},En=function(){for(var n=new Int32Array(256),r=0;r<256;++r){for(var t=r,e=9;--e;)t=(t&1&&-306674912)^t>>>1;n[r]=t}return n}(),Ar=function(){var n=-1;return{p:function(r){for(var t=n,e=0;e<r.length;++e)t=En[t&255^r[e]]^t>>>8;n=t},d:function(){return~n}}},Yr=function(){var n=1,r=0;return{p:function(t){for(var e=n,i=r,a=t.length|0,o=0;o!=a;){for(var s=Math.min(o+2655,a);o<s;++o)i+=e+=t[o];e=(e&65535)+15*(e>>16),i=(i&65535)+15*(i>>16)}n=e,r=i},d:function(){return n%=65521,r%=65521,(n&255)<<24|(n&65280)<<8|(r&255)<<8|r>>8}}},hr=function(n,r,t,e,i){if(!i&&(i={l:1},r.dictionary)){var a=r.dictionary.subarray(-32768),o=new U(a.length+n.length);o.set(a),o.set(n,a.length),n=o,i.w=a.length}return Bn(n,r.level==null?6:r.level,r.mem==null?Math.ceil(Math.max(8,Math.min(13,Math.log(n.length)))*1.5):12+r.mem,t,e,i)},Er=function(n,r){var t={};for(var e in n)t[e]=n[e];for(var e in r)t[e]=r[e];return t},pn=function(n,r,t){for(var e=n(),i=n.toString(),a=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),o=0;o<e.length;++o){var s=e[o],l=a[o];if(typeof s=="function"){r+=";"+l+"=";var f=s.toString();if(s.prototype)if(f.indexOf("[native code]")!=-1){var u=f.indexOf(" ",8)+1;r+=f.slice(u,f.indexOf("(",u))}else{r+=f;for(var h in s.prototype)r+=";"+l+".prototype."+h+"="+s.prototype[h].toString()}else r+=f}else t[l]=s}return r},Pr=[],Vn=function(n){var r=[];for(var t in n)n[t].buffer&&r.push((n[t]=new n[t].constructor(n[t])).buffer);return r},Gn=function(n,r,t,e){if(!Pr[t]){for(var i="",a={},o=n.length-1,s=0;s<o;++s)i=pn(n[s],i,a);Pr[t]={c:pn(n[o],i,a),e:a}}var l=Er({},Pr[t].e);return Qn(Pr[t].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+r.toString()+"}",t,l,Vn(l),e)},Mr=function(){return[U,W,Zr,mr,xr,Cr,tn,Fn,Sn,Cn,Ir,In,V,$r,Q,qr,zr,X,p,Br,Gr,or,an]},Ur=function(){return[U,W,Zr,mr,xr,Cr,kr,Qr,Dn,tr,Tn,yr,Ir,Zn,ir,V,_,pr,Hr,Nr,Vr,gr,en,Xr,zr,X,Bn,hr,jr,or]},On=function(){return[on,fn,C,Ar,En]},Ln=function(){return[sn,qn]},Pn=function(){return[hn,C,Yr]},$n=function(){return[un]},or=function(n){return postMessage(n,[n.buffer])},an=function(n){return n&&{out:n.size&&new U(n.size),dictionary:n.dictionary}},Fr=function(n,r,t,e,i,a){var o=Gn(t,e,i,function(s,l){o.terminate(),a(s,l)});return o.postMessage([n,r],r.consume?[n.buffer]:[]),function(){o.terminate()}},b=function(n){return n.ondata=function(r,t){return postMessage([r,t],[r.buffer])},function(r){return n.push(r.data[0],r.data[1])}},Dr=function(n,r,t,e,i,a){var o,s=Gn(n,e,i,function(l,f){l?(s.terminate(),r.ondata.call(r,l)):Array.isArray(f)?(f[1]&&s.terminate(),r.ondata.call(r,l,f[0],f[1])):a(f)});s.postMessage(t),r.push=function(l,f){r.ondata||p(5),o&&r.ondata(p(4,0,1),null,!!f),s.postMessage([l,o=f],[l.buffer])},r.terminate=function(){s.terminate()}},R=function(n,r){return n[r]|n[r+1]<<8},q=function(n,r){return(n[r]|n[r+1]<<8|n[r+2]<<16|n[r+3]<<24)>>>0},Kr=function(n,r){return q(n,r)+q(n,r+4)*4294967296},C=function(n,r,t){for(;t;++r)n[r]=t,t>>>=8},on=function(n,r){var t=r.filename;if(n[0]=31,n[1]=139,n[2]=8,n[8]=r.level<2?4:r.level==9?2:0,n[9]=3,r.mtime!=0&&C(n,4,Math.floor(new Date(r.mtime||Date.now())/1e3)),t){n[3]=8;for(var e=0;e<=t.length;++e)n[e+10]=t.charCodeAt(e)}},sn=function(n){(n[0]!=31||n[1]!=139||n[2]!=8)&&p(6,"invalid gzip data");var r=n[3],t=10;r&4&&(t+=(n[10]|n[11]<<8)+2);for(var e=(r>>3&1)+(r>>4&1);e>0;e-=!n[t++]);return t+(r&2)},qn=function(n){var r=n.length;return(n[r-4]|n[r-3]<<8|n[r-2]<<16|n[r-1]<<24)>>>0},fn=function(n){return 10+(n.filename?n.filename.length+1:0)},hn=function(n,r){var t=r.level,e=t==0?0:t<6?1:t==9?3:2;if(n[0]=120,n[1]=e<<6|(r.dictionary&&32),n[1]|=31-(n[0]<<8|n[1])%31,r.dictionary){var i=Yr();i.p(r.dictionary),C(n,2,i.d())}},un=function(n,r){return((n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31)&&p(6,"invalid zlib data"),(n[1]>>5&1)==+!r&&p(6,"invalid zlib data: "+(n[1]&32?"need":"unexpected")+" dictionary"),(n[1]>>3&4)+2};function ur(n,r){return typeof n=="function"&&(r=n,n={}),this.ondata=r,n}var er=function(){function n(r,t){if(typeof r=="function"&&(t=r,r={}),this.ondata=t,this.o=r||{},this.s={l:0,i:32768,w:32768,z:32768},this.b=new U(98304),this.o.dictionary){var e=this.o.dictionary.subarray(-32768);this.b.set(e,32768-e.length),this.s.i=32768-e.length}}return n.prototype.p=function(r,t){this.ondata(hr(r,this.o,0,0,this.s),t)},n.prototype.push=function(r,t){this.ondata||p(5),this.s.l&&p(4);var e=r.length+this.s.z;if(e>this.b.length){if(e>2*this.b.length-32768){var i=new U(e&-32768);i.set(this.b.subarray(0,this.s.z)),this.b=i}var a=this.b.length-this.s.z;a&&(this.b.set(r.subarray(0,a),this.s.z),this.s.z=this.b.length,this.p(this.b,!1)),this.b.set(this.b.subarray(-32768)),this.b.set(r.subarray(a),32768),this.s.z=r.length-a+32768,this.s.i=32766,this.s.w=32768}else this.b.set(r,this.s.z),this.s.z+=r.length;this.s.l=t&1,(this.s.z>this.s.w+8191||t)&&(this.p(this.b,t||!1),this.s.w=this.s.i,this.s.i-=2)},n}();var Xn=function(){function n(r,t){Dr([Ur,function(){return[b,er]}],this,ur.call(this,r,t),function(e){var i=new er(e.data);onmessage=b(i)},6)}return n}();function bn(n,r,t){return t||(t=r,r={}),typeof t!="function"&&p(7),Fr(n,r,[Ur],function(e){return or(jr(e.data[0],e.data[1]))},0,t)}function jr(n,r){return hr(n,r||{},0,0)}var K=function(){function n(r,t){typeof r=="function"&&(t=r,r={}),this.ondata=t;var e=r&&r.dictionary&&r.dictionary.subarray(-32768);this.s={i:0,b:e?e.length:0},this.o=new U(32768),this.p=new U(0),e&&this.o.set(e)}return n.prototype.e=function(r){if(this.ondata||p(5),this.d&&p(4),!this.p.length)this.p=r;else if(r.length){var t=new U(this.p.length+r.length);t.set(this.p),t.set(r,this.p.length),this.p=t}},n.prototype.c=function(r){this.s.i=+(this.d=r||!1);var t=this.s.b,e=Br(this.p,this.s,this.o);this.ondata(X(e,t,this.s.b),this.d),this.o=X(e,this.s.b-32768),this.s.b=this.o.length,this.p=X(this.p,this.s.p/8|0),this.s.p&=7},n.prototype.push=function(r,t){this.e(r),this.c(t)},n}();var Hn=function(){function n(r,t){Dr([Mr,function(){return[b,K]}],this,ur.call(this,r,t),function(e){var i=new K(e.data);onmessage=b(i)},7)}return n}();function kn(n,r,t){return t||(t=r,r={}),typeof t!="function"&&p(7),Fr(n,r,[Mr],function(e){return or(Gr(e.data[0],an(e.data[1])))},1,t)}function Gr(n,r){return Br(n,{i:2},r&&r.out,r&&r.dictionary)}var gn=function(){function n(r,t){this.c=Ar(),this.l=0,this.v=1,er.call(this,r,t)}return n.prototype.push=function(r,t){this.c.p(r),this.l+=r.length,er.prototype.push.call(this,r,t)},n.prototype.p=function(r,t){var e=hr(r,this.o,this.v&&fn(this.o),t&&8,this.s);this.v&&(on(e,this.o),this.v=0),t&&(C(e,e.length-8,this.c.d()),C(e,e.length-4,this.l)),this.ondata(e,t)},n}();var it=function(){function n(r,t){Dr([Ur,On,function(){return[b,er,gn]}],this,ur.call(this,r,t),function(e){var i=new gn(e.data);onmessage=b(i)},8)}return n}();function at(n,r,t){return t||(t=r,r={}),typeof t!="function"&&p(7),Fr(n,r,[Ur,On,function(){return[yn]}],function(e){return or(yn(e.data[0],e.data[1]))},2,t)}function yn(n,r){r||(r={});var t=Ar(),e=n.length;t.p(n);var i=hr(n,r,fn(r),8),a=i.length;return on(i,r),C(i,a-8,t.d()),C(i,a-4,e),i}var br=function(){function n(r,t){this.v=1,this.r=0,K.call(this,r,t)}return n.prototype.push=function(r,t){if(K.prototype.e.call(this,r),this.r+=r.length,this.v){var e=this.p.subarray(this.v-1),i=e.length>3?sn(e):4;if(i>e.length){if(!t)return}else this.v>1&&this.onmember&&this.onmember(this.r-e.length);this.p=e.subarray(i),this.v=0}K.prototype.c.call(this,t),this.s.f&&!this.s.l&&(this.v=zr(this.s.p)+9,this.s={i:0},this.o=new U(0),this.p.length&&this.push(new U(0),t))},n}();var dn=function(){function n(r,t){var e=this;Dr([Mr,Ln,function(){return[b,K,br]}],this,ur.call(this,r,t),function(i){var a=new br(i.data);a.onmember=function(o){return postMessage(o)},onmessage=b(a)},9,function(i){return e.onmember&&e.onmember(i)})}return n}();function _n(n,r,t){return t||(t=r,r={}),typeof t!="function"&&p(7),Fr(n,r,[Mr,Ln,function(){return[dr]}],function(e){return or(dr(e.data[0],e.data[1]))},3,t)}function dr(n,r){var t=sn(n);return t+8>n.length&&p(6,"invalid gzip data"),Br(n.subarray(t,-8),{i:2},r&&r.out||new U(qn(n)),r&&r.dictionary)}var wn=function(){function n(r,t){this.c=Yr(),this.v=1,er.call(this,r,t)}return n.prototype.push=function(r,t){this.c.p(r),er.prototype.push.call(this,r,t)},n.prototype.p=function(r,t){var e=hr(r,this.o,this.v&&(this.o.dictionary?6:2),t&&4,this.s);this.v&&(hn(e,this.o),this.v=0),t&&C(e,e.length-4,this.c.d()),this.ondata(e,t)},n}();var ot=function(){function n(r,t){Dr([Ur,Pn,function(){return[b,er,wn]}],this,ur.call(this,r,t),function(e){var i=new wn(e.data);onmessage=b(i)},10)}return n}();function st(n,r,t){return t||(t=r,r={}),typeof t!="function"&&p(7),Fr(n,r,[Ur,Pn,function(){return[mn]}],function(e){return or(mn(e.data[0],e.data[1]))},4,t)}function mn(n,r){r||(r={});var t=Yr();t.p(n);var e=hr(n,r,r.dictionary?6:2,4);return hn(e,r),C(e,e.length-4,t.d()),e}var _r=function(){function n(r,t){K.call(this,r,t),this.v=r&&r.dictionary?2:1}return n.prototype.push=function(r,t){if(K.prototype.e.call(this,r),this.v){if(this.p.length<6&&!t)return;this.p=this.p.subarray(un(this.p,this.v-1)),this.v=0}t&&(this.p.length<4&&p(6,"invalid zlib data"),this.p=this.p.subarray(0,-4)),K.prototype.c.call(this,t)},n}();var rt=function(){function n(r,t){Dr([Mr,$n,function(){return[b,K,_r]}],this,ur.call(this,r,t),function(e){var i=new _r(e.data);onmessage=b(i)},11)}return n}();function nt(n,r,t){return t||(t=r,r={}),typeof t!="function"&&p(7),Fr(n,r,[Mr,$n,function(){return[rn]}],function(e){return or(rn(e.data[0],an(e.data[1])))},5,t)}function rn(n,r){return Br(n.subarray(un(n,r&&r.dictionary),-4),{i:2},r&&r.out,r&&r.dictionary)}var xn=function(){function n(r,t){this.G=br,this.I=K,this.Z=_r,this.o=ur.call(this,r,t)||{}}return n.prototype.push=function(r,t){if(this.ondata||p(5),this.s)this.s.push(r,t);else{if(this.p&&this.p.length){var e=new U(this.p.length+r.length);e.set(this.p),e.set(r,this.p.length)}else this.p=r;if(this.p.length>2){var i=this,a=function(){i.ondata.apply(i,arguments)};this.s=this.p[0]==31&&this.p[1]==139&&this.p[2]==8?new this.G(this.o,a):(this.p[0]&15)!=8||this.p[0]>>4>7||(this.p[0]<<8|this.p[1])%31?new this.I(this.o,a):new this.Z(this.o,a),this.s.push(this.p,t),this.p=null}}},n}();var ft=function(){function n(r,t){this.G=dn,this.I=Hn,this.Z=rt,xn.call(this,r,t)}return n.prototype.push=function(r,t){xn.prototype.push.call(this,r,t)},n}();function ht(n,r,t){return t||(t=r,r={}),typeof t!="function"&&p(7),n[0]==31&&n[1]==139&&n[2]==8?_n(n,r,t):(n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31?kn(n,r,t):nt(n,r,t)}function ut(n,r){return n[0]==31&&n[1]==139&&n[2]==8?dr(n,r):(n[0]&15)!=8||n[0]>>4>7||(n[0]<<8|n[1])%31?Gr(n,r):rn(n,r)}var ln=function(n,r,t,e){for(var i in n){var a=n[i],o=r+i,s=e;Array.isArray(a)&&(s=Er(e,a[1]),a=a[0]),a instanceof U?t[o]=[a,s]:(t[o+="/"]=[new U(0),s],ln(a,o,t,e))}},zn=typeof TextEncoder<"u"&&new TextEncoder,nn=typeof TextDecoder<"u"&&new TextDecoder,Nn=0;try{nn.decode(ir,{stream:!0}),Nn=1}catch{}var Rn=function(n){for(var r="",t=0;;){var e=n[t++],i=(e>127)+(e>223)+(e>239);if(t+i>n.length)return{s:r,r:X(n,t-1)};i?i==3?(e=((e&15)<<18|(n[t++]&63)<<12|(n[t++]&63)<<6|n[t++]&63)-65536,r+=String.fromCharCode(55296|e>>10,56320|e&1023)):i&1?r+=String.fromCharCode((e&31)<<6|n[t++]&63):r+=String.fromCharCode((e&15)<<12|(n[t++]&63)<<6|n[t++]&63):r+=String.fromCharCode(e)}},lt=function(){function n(r){this.ondata=r,Nn?this.t=new TextDecoder:this.p=ir}return n.prototype.push=function(r,t){if(this.ondata||p(5),t=!!t,this.t){this.ondata(this.t.decode(r,{stream:!0}),t),t&&(this.t.decode().length&&p(8),this.t=null);return}this.p||p(4);var e=new U(this.p.length+r.length);e.set(this.p),e.set(r,this.p.length);var i=Rn(e),a=i.s,o=i.r;t?(o.length&&p(8),this.p=null):this.p=o,this.ondata(a,t)},n}();var vt=function(){function n(r){this.ondata=r}return n.prototype.push=function(r,t){this.ondata||p(5),this.d&&p(4),this.ondata(fr(r),this.d=t||!1)},n}();function fr(n,r){if(r){for(var t=new U(n.length),e=0;e<n.length;++e)t[e]=n.charCodeAt(e);return t}if(zn)return zn.encode(n);for(var i=n.length,a=new U(n.length+(n.length>>1)),o=0,s=function(u){a[o++]=u},e=0;e<i;++e){if(o+5>a.length){var l=new U(o+8+(i-e<<1));l.set(a),a=l}var f=n.charCodeAt(e);f<128||r?s(f):f<2048?(s(192|f>>6),s(128|f&63)):f>55295&&f<57344?(f=65536+(f&1047552)|n.charCodeAt(++e)&1023,s(240|f>>18),s(128|f>>12&63),s(128|f>>6&63),s(128|f&63)):(s(224|f>>12),s(128|f>>6&63),s(128|f&63))}return X(a,0,o)}function Wn(n,r){if(r){for(var t="",e=0;e<n.length;e+=16384)t+=String.fromCharCode.apply(null,n.subarray(e,e+16384));return t}else{if(nn)return nn.decode(n);var i=Rn(n),a=i.s,t=i.r;return t.length&&p(8),a}}var Yn=function(n){return n==1?3:n<6?2:n==9?1:0},jn=function(n,r){return r+30+R(n,r+26)+R(n,r+28)},Jn=function(n,r,t){var e=R(n,r+28),i=Wn(n.subarray(r+46,r+46+e),!(R(n,r+8)&2048)),a=r+46+e,o=q(n,r+20),s=t&&o==4294967295?Kn(n,a):[o,q(n,r+24),q(n,r+42)],l=s[0],f=s[1],u=s[2];return[R(n,r+10),l,f,i,a+R(n,r+30)+R(n,r+32),u]},Kn=function(n,r){for(;R(n,r)!=1;r+=4+R(n,r+2));return[Kr(n,r+12),Kr(n,r+4),Kr(n,r+20)]},ar=function(n){var r=0;if(n)for(var t in n){var e=n[t].length;e>65535&&p(9),r+=e+4}return r},wr=function(n,r,t,e,i,a,o,s){var l=e.length,f=t.extra,u=s&&s.length,h=ar(f);C(n,r,o!=null?33639248:67324752),r+=4,o!=null&&(n[r++]=20,n[r++]=t.os),n[r]=20,r+=2,n[r++]=t.flag<<1|(a<0&&8),n[r++]=i&&8,n[r++]=t.compression&255,n[r++]=t.compression>>8;var v=new Date(t.mtime==null?Date.now():t.mtime),M=v.getFullYear()-1980;if((M<0||M>119)&&p(10),C(n,r,M<<25|v.getMonth()+1<<21|v.getDate()<<16|v.getHours()<<11|v.getMinutes()<<5|v.getSeconds()>>1),r+=4,a!=-1&&(C(n,r,t.crc),C(n,r+4,a<0?-a-2:a),C(n,r+8,t.size)),C(n,r+12,l),C(n,r+14,h),r+=16,o!=null&&(C(n,r,u),C(n,r+6,t.attrs),C(n,r+10,o),r+=14),n.set(e,r),r+=l,h)for(var m in f){var z=f[m],c=z.length;C(n,r,+m),C(n,r+2,c),n.set(z,r+4),r+=4+c}return u&&(n.set(s,r),r+=u),r},vn=function(n,r,t,e,i){C(n,r,101010256),C(n,r+8,t),C(n,r+10,t),C(n,r+12,e),C(n,r+16,i)},Rr=function(){function n(r){this.filename=r,this.c=Ar(),this.size=0,this.compression=0}return n.prototype.process=function(r,t){this.ondata(null,r,t)},n.prototype.push=function(r,t){this.ondata||p(5),this.c.p(r),this.size+=r.length,t&&(this.crc=this.c.d()),this.process(r,t||!1)},n}();var ct=function(){function n(r,t){var e=this;t||(t={}),Rr.call(this,r),this.d=new er(t,function(i,a){e.ondata(null,i,a)}),this.compression=8,this.flag=Yn(t.level)}return n.prototype.process=function(r,t){try{this.d.push(r,t)}catch(e){this.ondata(e,null,t)}},n.prototype.push=function(r,t){Rr.prototype.push.call(this,r,t)},n}();var pt=function(){function n(r,t){var e=this;t||(t={}),Rr.call(this,r),this.d=new Xn(t,function(i,a,o){e.ondata(i,a,o)}),this.compression=8,this.flag=Yn(t.level),this.terminate=this.d.terminate}return n.prototype.process=function(r,t){this.d.push(r,t)},n.prototype.push=function(r,t){Rr.prototype.push.call(this,r,t)},n}();var gt=function(){function n(r){this.ondata=r,this.u=[],this.d=1}return n.prototype.add=function(r){var t=this;if(this.ondata||p(5),this.d&2)this.ondata(p(4+(this.d&1)*8,0,1),null,!1);else{var e=fr(r.filename),i=e.length,a=r.comment,o=a&&fr(a),s=i!=r.filename.length||o&&a.length!=o.length,l=i+ar(r.extra)+30;i>65535&&this.ondata(p(11,0,1),null,!1);var f=new U(l);wr(f,0,r,e,s,-1);var u=[f],h=function(){for(var c=0,x=u;c<x.length;c++){var F=x[c];t.ondata(null,F,!1)}u=[]},v=this.d;this.d=0;var M=this.u.length,m=Er(r,{f:e,u:s,o,t:function(){r.terminate&&r.terminate()},r:function(){if(h(),v){var c=t.u[M+1];c?c.r():t.d=1}v=1}}),z=0;r.ondata=function(c,x,F){if(c)t.ondata(c,x,F),t.terminate();else if(z+=x.length,u.push(x),F){var A=new U(16);C(A,0,134695760),C(A,4,r.crc),C(A,8,z),C(A,12,r.size),u.push(A),m.c=z,m.b=l+z+16,m.crc=r.crc,m.size=r.size,v&&m.r(),v=1}else v&&h()},this.u.push(m)}},n.prototype.end=function(){var r=this;if(this.d&2){this.ondata(p(4+(this.d&1)*8,0,1),null,!0);return}this.d?this.e():this.u.push({r:function(){r.d&1&&(r.u.splice(-1,1),r.e())},t:function(){}}),this.d=3},n.prototype.e=function(){for(var r=0,t=0,e=0,i=0,a=this.u;i<a.length;i++){var o=a[i];e+=46+o.f.length+ar(o.extra)+(o.o?o.o.length:0)}for(var s=new U(e+22),l=0,f=this.u;l<f.length;l++){var o=f[l];wr(s,r,o,o.f,o.u,-o.c-2,t,o.o),r+=46+o.f.length+ar(o.extra)+(o.o?o.o.length:0),t+=o.b}vn(s,r,this.u.length,e,t),this.ondata(null,s,!0),this.d=2},n.prototype.terminate=function(){for(var r=0,t=this.u;r<t.length;r++){var e=t[r];e.t()}this.d=2},n}();function yt(n,r,t){t||(t=r,r={}),typeof t!="function"&&p(7);var e={};ln(n,"",e,r);var i=Object.keys(e),a=i.length,o=0,s=0,l=a,f=new Array(a),u=[],h=function(){for(var c=0;c<u.length;++c)u[c]()},v=function(c,x){Wr(function(){t(c,x)})};Wr(function(){v=t});var M=function(){var c=new U(s+22),x=o,F=s-o;s=0;for(var A=0;A<l;++A){var y=f[A];try{var Z=y.c.length;wr(c,s,y,y.f,y.u,Z);var B=30+y.f.length+ar(y.extra),S=s+B;c.set(y.c,S),wr(c,o,y,y.f,y.u,Z,s,y.m),o+=16+B+(y.m?y.m.length:0),s=S+Z}catch(w){return v(w,null)}}vn(c,o,f.length,F,x),v(null,c)};a||M();for(var m=function(c){var x=i[c],F=e[x],A=F[0],y=F[1],Z=Ar(),B=A.length;Z.p(A);var S=fr(x),w=S.length,g=y.comment,D=g&&fr(g),T=D&&D.length,O=ar(y.extra),H=y.level==0?0:8,G=function(P,L){if(P)h(),v(P,null);else{var E=L.length;f[c]=Er(y,{size:B,crc:Z.d(),c:L,f:S,m:D,u:w!=x.length||D&&g.length!=T,compression:H}),o+=30+w+O+E,s+=76+2*(w+O)+(T||0)+E,--a||M()}};if(w>65535&&G(p(11,0,1),null),!H)G(null,A);else if(B<16e4)try{G(null,jr(A,y))}catch(P){G(P,null)}else u.push(bn(A,y,G))},z=0;z<l;++z)m(z);return h}function wt(n,r){r||(r={});var t={},e=[];ln(n,"",t,r);var i=0,a=0;for(var o in t){var s=t[o],l=s[0],f=s[1],u=f.level==0?0:8,h=fr(o),v=h.length,M=f.comment,m=M&&fr(M),z=m&&m.length,c=ar(f.extra);v>65535&&p(11);var x=u?jr(l,f):l,F=x.length,A=Ar();A.p(l),e.push(Er(f,{size:l.length,crc:A.d(),c:x,f:h,m,u:v!=o.length||m&&M.length!=z,o:i,compression:u})),i+=30+v+c+F,a+=76+2*(v+c)+(z||0)+F}for(var y=new U(a+22),Z=i,B=a-i,S=0;S<e.length;++S){var h=e[S];wr(y,h.o,h,h.f,h.u,h.c.length);var w=30+h.f.length+ar(h.extra);y.set(h.c,h.o+w),wr(y,i,h,h.f,h.u,h.c.length,h.o,h.m),i+=16+w+(h.m?h.m.length:0)}return vn(y,i,e.length,B,Z),y}var tt=function(){function n(){}return n.prototype.push=function(r,t){this.ondata(null,r,t)},n.compression=0,n}();var mt=function(){function n(){var r=this;this.i=new K(function(t,e){r.ondata(null,t,e)})}return n.prototype.push=function(r,t){try{this.i.push(r,t)}catch(e){this.ondata(e,null,t)}},n.compression=8,n}();var xt=function(){function n(r,t){var e=this;t<32e4?this.i=new K(function(i,a){e.ondata(null,i,a)}):(this.i=new Hn(function(i,a,o){e.ondata(i,a,o)}),this.terminate=this.i.terminate)}return n.prototype.push=function(r,t){this.i.terminate&&(r=X(r,0)),this.i.push(r,t)},n.compression=8,n}();var zt=function(){function n(r){this.onfile=r,this.k=[],this.o={0:tt},this.p=ir}return n.prototype.push=function(r,t){var e=this;if(this.onfile||p(5),this.p||p(4),this.c>0){var i=Math.min(this.c,r.length),a=r.subarray(0,i);if(this.c-=i,this.d?this.d.push(a,!this.c):this.k[0].push(a),r=r.subarray(i),r.length)return this.push(r,t)}else{var o=0,s=0,l=void 0,f=void 0;this.p.length?r.length?(f=new U(this.p.length+r.length),f.set(this.p),f.set(r,this.p.length)):f=this.p:f=r;for(var u=f.length,h=this.c,v=h&&this.d,M=function(){var x,F=q(f,s);if(F==67324752){o=1,l=s,m.d=null,m.c=0;var A=R(f,s+6),y=R(f,s+8),Z=A&2048,B=A&8,S=R(f,s+26),w=R(f,s+28);if(u>s+30+S+w){var g=[];m.k.unshift(g),o=2;var D=q(f,s+18),T=q(f,s+22),O=Wn(f.subarray(s+30,s+=30+S),!Z);D==4294967295?(x=B?[-2]:Kn(f,s),D=x[0],T=x[1]):B&&(D=-1),s+=w,m.c=D;var H,G={name:O,compression:y,start:function(){if(G.ondata||p(5),!D)G.ondata(null,ir,!0);else{var P=e.o[y];P||G.ondata(p(14,"unknown compression type "+y,1),null,!1),H=D<0?new P(O):new P(O,D,T),H.ondata=function(k,sr,Y){G.ondata(k,sr,Y)};for(var L=0,E=g;L<E.length;L++){var N=E[L];H.push(N,!1)}e.k[0]==g&&e.c?e.d=H:H.push(ir,!0)}},terminate:function(){H&&H.terminate&&H.terminate()}};D>=0&&(G.size=D,G.originalSize=T),m.onfile(G)}return"break"}else if(h){if(F==134695760)return l=s+=12+(h==-2&&8),o=3,m.c=0,"break";if(F==33639248)return l=s-=4,o=3,m.c=0,"break"}},m=this;s<u-4;++s){var z=M();if(z==="break")break}if(this.p=ir,h<0){var c=o?f.subarray(0,l-12-(h==-2&&8)-(q(f,l-16)==134695760&&4)):f.subarray(0,s);v?v.push(c,!!o):this.k[+(o==2)].push(c)}if(o&2)return this.push(f.subarray(s),t);this.p=f.subarray(s)}t&&(this.c&&p(13),this.p=null)},n.prototype.register=function(r){this.o[r.compression]=r},n}();var Wr=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(n){n()};function At(n,r,t){t||(t=r,r={}),typeof t!="function"&&p(7);var e=[],i=function(){for(var c=0;c<e.length;++c)e[c]()},a={},o=function(c,x){Wr(function(){t(c,x)})};Wr(function(){o=t});for(var s=n.length-22;q(n,s)!=101010256;--s)if(!s||n.length-s>65558)return o(p(13,0,1),null),i;var l=R(n,s+8);if(l){var f=l,u=q(n,s+16),h=u==4294967295||f==65535;if(h){var v=q(n,s-12);h=q(n,v)==101075792,h&&(f=l=q(n,v+32),u=q(n,v+48))}for(var M=r&&r.filter,m=function(c){var x=Jn(n,u,h),F=x[0],A=x[1],y=x[2],Z=x[3],B=x[4],S=x[5],w=jn(n,S);u=B;var g=function(T,O){T?(i(),o(T,null)):(O&&(a[Z]=O),--l||o(null,a))};if(!M||M({name:Z,size:A,originalSize:y,compression:F}))if(!F)g(null,X(n,w,w+A));else if(F==8){var D=n.subarray(w,w+A);if(A<32e4)try{g(null,Gr(D,{out:new U(y)}))}catch(T){g(T,null)}else e.push(kn(D,{size:y},g))}else g(p(14,"unknown compression type "+F,1),null);else g(null,null)},z=0;z<f;++z)m(z)}else o(null,{});return i}function Mt(n,r){for(var t={},e=n.length-22;q(n,e)!=101010256;--e)(!e||n.length-e>65558)&&p(13);var i=R(n,e+8);if(!i)return{};var a=q(n,e+16),o=a==4294967295||i==65535;if(o){var s=q(n,e-12);o=q(n,s)==101075792,o&&(i=q(n,s+32),a=q(n,s+48))}for(var l=r&&r.filter,f=0;f<i;++f){var u=Jn(n,a,o),h=u[0],v=u[1],M=u[2],m=u[3],z=u[4],c=u[5],x=jn(n,c);a=z,(!l||l({name:m,size:v,originalSize:M,compression:h}))&&(h?h==8?t[m]=Gr(n.subarray(x,x+v),{out:new U(M)}):p(14,"unknown compression type "+h):t[m]=X(n,x,x+v))}return t}export{it as AsyncCompress,ft as AsyncDecompress,Xn as AsyncDeflate,dn as AsyncGunzip,it as AsyncGzip,Hn as AsyncInflate,xt as AsyncUnzipInflate,rt as AsyncUnzlib,pt as AsyncZipDeflate,ot as AsyncZlib,gn as Compress,lt as DecodeUTF8,xn as Decompress,er as Deflate,vt as EncodeUTF8,et as FlateErrorCode,br as Gunzip,gn as Gzip,K as Inflate,zt as Unzip,mt as UnzipInflate,tt as UnzipPassThrough,_r as Unzlib,gt as Zip,ct as ZipDeflate,Rr as ZipPassThrough,wn as Zlib,at as compress,yn as compressSync,ht as decompress,ut as decompressSync,bn as deflate,jr as deflateSync,_n as gunzip,dr as gunzipSync,at as gzip,yn as gzipSync,kn as inflate,Gr as inflateSync,Wn as strFromU8,fr as strToU8,At as unzip,Mt as unzipSync,nt as unzlib,rn as unzlibSync,yt as zip,wt as zipSync,st as zlib,mn as zlibSync};
//# sourceMappingURL=fflate.mjs.map