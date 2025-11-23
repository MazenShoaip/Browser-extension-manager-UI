if (localStorage.dark === "true") {
	document.querySelector("body").classList.add("dark");
} else {
	localStorage.dark = false;
	document.querySelector("body").classList.remove("dark");
}

function create(classes = "", type = "div") {
	let e = document.createElement(type);
	if (classes !== "") e.classList.add(...classes.split(" "));
	return e;
}
let extensionsList = [];

function createExtension(name, desc, logo, active) {
	let e = create("extension");
	let info = create("info");
	let img = create("img", "img");
	img.src = logo;
	let text = create("text");
	let h3 = create("", "h3");
	h3.textContent = name;
	let des = create("desc", "p");
	des.textContent = desc;
	text.append(h3);
	text.append(des);
	info.append(img);
	info.append(text);
	e.append(info);
	let settings = create("settings");
	let deleteExtension = create("delete");
	deleteExtension.textContent = "Remove";
	deleteExtension.tabIndex = 0;
	deleteExtension.addEventListener("click", () => {
		extensionsList = extensionsList.filter((t) => t !== e);
		e.remove();
	});
	let toggle = create("toggle");
	toggle.tabIndex = 0;
	let checkbox = create("", "input");
	checkbox.type = "checkbox";
	let slider = create("slider", "span");
	checkbox.checked = active;
	toggle.append(checkbox);
	toggle.append(slider);
	toggle.addEventListener("click", (e) => {
		checkbox.checked = !checkbox.checked;
	});
	settings.append(deleteExtension);
	settings.append(toggle);
	e.append(settings);
	return e;
}
let extensions = document.querySelector(".extensions");
document.querySelector(".mode").addEventListener("click", () => {
	let body = document.querySelector("body");
	body.classList.toggle("dark");
	localStorage.dark = body.classList.contains("dark");
});
let data;
await fetch("data.json")
	.then((e) => e.json())
	.then((e) => (data = e));

for (let ex of data) {
	let ext = createExtension(ex.name, ex.description, ex.logo, ex.isActive);
	extensions.append(ext);
	extensionsList.push(ext);
}

let filters = document.querySelectorAll(".filter");
for (let filter of filters) {
	filter.addEventListener("click", (e) => {
		filters.forEach((f) => f.classList.remove("selected"));
		e.target.classList.add("selected");
		let l = [];
		if (filter.textContent == "All") {
			l = [true, false];
		} else if (filter.textContent == "Active") {
			l = [true];
		} else {
			l = [false];
		}
		extensions.innerHTML = "";
		for (let ex of extensionsList) {
			if (l.includes(ex.querySelector("input").checked)) {
				extensions.append(ex);
			}
		}
	});
}
