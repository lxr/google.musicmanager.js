function stacklen(S) {
	return S["length"]
}

function stackpeek(S) {
	return S[S["length"]-1]
}

function stackpop(S) {
	return S["length"] > 0 ? S[--S["length"]] : ""
}

function stackpush(S,x) {
	S[S["length"]++] = x
	return S["length"]
}

function lstrip0(rs) {
	if(!match($0, "^" rs))
		return
	rs = substr($0, 1, RLENGTH)
	$0 = substr($0, RLENGTH+1)
	return rs
}

function dirname(path) {
	if(match(path, "^.*/"))
		return substr(path, 1, RLENGTH)
	else
		return ""
}

function cleanpath(path) {
	gsub("/+", "/", path)
	gsub("/\\./", "/", path)
	gsub("[^/]+/\\.\\./", "", path)
	gsub("^\\./", "", path)
	gsub("^/\\.\\./", "/", path)
	return path
}

function require(path) {
	path = cleanpath(dirname(stackpeek(files)) path)
	if(path in required) return
	required[path] = stackpeek(files)
	stackpush(files, path)
	stackpush(indent, stackpeek(indent) lstrip0("[ 	]*"))
}

BEGIN {
	# status:	int
	# required:	hashmap
	# files:	stack
	# indent:	stack
	for(FN = 1; FN < ARGC; ++FN) {
		require(ARGV[FN])
		while(stacklen(files)) {
			while((status = getline < stackpeek(files)) > 0) {
				if($1 == "//require")
					require($2)
				else
					print stackpeek(indent) $0
			}
			if(status == -1) {
				print ARGV[0] ": open/read error: " \
					stackpeek(files) > "/dev/stderr"
				exit 1
			}
			stackpop(files)
			stackpop(indent)
		}
	}
}
