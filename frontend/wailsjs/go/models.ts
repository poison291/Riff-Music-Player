export namespace main {
	
	export class Song {
	    id: number;
	    title: string;
	    artist: string;
	    album: string;
	    path: string;
	    ext: string;
	    image: string;
	    duration: number;
	    streamUrl: string;
	    bundled: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Song(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.artist = source["artist"];
	        this.album = source["album"];
	        this.path = source["path"];
	        this.ext = source["ext"];
	        this.image = source["image"];
	        this.duration = source["duration"];
	        this.streamUrl = source["streamUrl"];
	        this.bundled = source["bundled"];
	    }
	}

}

