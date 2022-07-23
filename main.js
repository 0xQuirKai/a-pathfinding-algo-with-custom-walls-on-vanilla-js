var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


function removef(arr, elt) {
    for (i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == elt) {
            arr.splice(i, 1);

        }
    }
}
var col = 25;
var row = 25;
var grid = new Array(col);



canvas.width = innerWidth / 2;
canvas.height = innerHeight;
var openset = [];
var closeset = [];
var start;
var end;
var w, h;
w = canvas.width / col;
h = canvas.height / row;
var path = [];

function dist(a, b) {
    // di = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y));
    di = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    return di;
}

function spot(i, j) {
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.wall = false;
    this.show = function(color, scolor = 'cyan') {
        ctx.beginPath();
        ctx.rect(this.x * w, this.y * h, w, h);
        if (this.wall) {
            ctx.fillStyle = '#333';
            ctx.strokeStyle = '#333';


        } else {
            ctx.fillStyle = color;
            ctx.strokeStyle = scolor;

        }
        ctx.fill();

        ctx.stroke();

    }



    this.addneighbors = function(grid) {
        if (i < col - 1) {
            this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbors.push(grid[i - 1][j]);
        }
        if (j < row - 1) {
            this.neighbors.push(grid[i][j + 1]);
        }

        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }

    }
}


for (var i = 0; i < col; i++) {
    grid[i] = new Array(row);
}


function createGrid() {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            grid[i][j] = new spot(i, j);


        }
    }
}

function coloring() {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            grid[i][j].show('#20B2AA');


        }
    }
}
createGrid();
coloring();


for (var i = 0; i < row; i++) {
    for (var j = 0; j < col; j++) {

        grid[i][j].addneighbors(grid);

    }
};
start = grid[0][0];

start.show('#dc143c')
end = grid[row - 1][col - 1];
end.show('#DC143C');
// moving start and end points 


let moving = function(e) {

    if (Math.floor(e.clientX / w) == start.x && Math.floor(e.clientY / h) == start.y) {

        end.show('#dc143c')
        canvas.onmousemove = (e) => {
            start.show('#20B2AA');

            openset = [];
            start = grid[Math.floor(e.clientX / w)][Math.floor(e.clientY / h)];

            openset.push(start);
            start.show('#dc143ce6', '#666');
            canvas.onclick = stop;
        }


    } else if (Math.floor(e.clientX / w) == end.x && Math.floor(e.clientY / h) == end.y) {
        canvas.onmousemove = (e) => {
            end.show('#20B2AA');
            end = grid[Math.floor(e.clientX / w)][Math.floor(e.clientY / h)];
            end.show('#dc143ce6', '#666');
            canvas.onclick = stop;

        }
        end.x = Math.floor(e.clientX / w)
    }

}
let stop = e => {
        canvas.onmousemove = () => {
            return;
        }
        grid[Math.floor(e.clientX / w)][Math.floor(e.clientY / h)].wall = false;
        start.show('#dc143c');
        end.show('#dc143c');
        canvas.onclick = wall;

    }
    // creating wall from clicking the blocks
let wall = function(e) {
    if (grid[Math.floor(e.clientX / w)][Math.floor(e.clientY / h)].wall || start.x == Math.floor(e.clientX / w) && start.y == Math.floor(e.clientY / h) || end.x == Math.floor(e.clientX / w) && end.y == Math.floor(e.clientY / h)) {
        grid[Math.floor(e.clientX / w)][Math.floor(e.clientY / h)].wall = false;
        grid[Math.floor(e.clientX / w)][Math.floor(e.clientY / h)].show('#20B2AA')
        start.show('#dc143c');
        end.show('#dc143c')
    } else {
        grid[Math.floor(e.clientX / w)][Math.floor(e.clientY / h)].show('#333', '#333')

        grid[Math.floor(e.clientX / w)][Math.floor(e.clientY / h)].wall = true;

    }
}

canvas.onmousedown = moving;
canvas.onclick = wall;
openset.push(start);


function launch() {

    var winner = 0;
    for (i = 0; i < openset.length; i++) {
        if (openset[i].f < openset[winner].f) {
            winner = i;


        }


    }



    current = openset[winner];

    if (current == end) {


        var temp = current;

        path.push(temp);
        while (temp.prev) {
            path.push(temp.prev);
            temp = temp.prev;

        }

        canvas.onmousemove = null;

        console.log(openset)
    }


    removef(openset, current);
    closeset.push(current);







    var neighbors = current.neighbors;

    for (i = 0; i < neighbors.length; i++) {
        var tempG;
        var newpath = false;
        var neighbor = neighbors[i];
        if (!closeset.includes(neighbor) && !neighbor.wall) {


            tempG = current.g + 1;

            if (openset.includes(neighbor)) {
                if (tempG < neighbor.g) {
                    neighbor.g = tempG;
                    newpath = true;
                }
            } else {
                openset.push(neighbor);
                neighbor.g = tempG;
                newpath = true;

            }

            if (newpath) {
                neighbor.h = dist(current, end);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.prev = current;
            }
        }
    }






    for (i = 0; i < closeset.length; i++) {

        closeset[i].show(`rgb(152,255,${47+(i*0.5)})`);

    }
    for (i = 0; i < openset.length; i++) {

        openset[i].show('#98FB98');

    }
    start.show('#DC143C');
    end.show('#DC143C');

    for (i = 0; i < path.length; i++) {
        // in case you want make path looks like a line uncomment below

        /* ctx.strokeStyle = 'purple';
        ctx.lineWidth = 1.2;

        ctx.moveTo(path[i].x * w + w / 2, path[i].y * h + h / 2);
        ctx.lineTo(path[i + 1].x * w + w / 2, path[i + 1].y * h + h / 2);
        ctx.stroke();*/
        var color = `rgb(182,114,${149+(i*3)})`;
        ctx.beginPath();
        ctx.rect(path[i].x * w, path[i].y * h, w, h);
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.fill();
        // stop the code when path drawing end
        if (path[i] == start) {
            return;
        }
    }









    requestAnimationFrame(launch);



}