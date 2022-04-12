document.addEventListener("DOMContentLoaded",() => {
    let pickerContainer = document.querySelector(".picker-container");
    addSegment(pickerContainer);
    document.querySelector(".add-picker").addEventListener("click", () => {
        addSegment(pickerContainer);
    });
});

/**
 * Add segment picker to parent
 * @param {Element} parent 
 */
function addSegment(parent) {
    let pickerDiv = document.createElement("div");
    pickerDiv.classList.add("picker");
    let segmentObject = document.createElement("object");
    segmentObject.classList.add("segments");
    segmentObject.type = "image/svg+xml";
    segmentObject.data = "./tunic_segments.svg";
    pickerDiv.appendChild(segmentObject);
    let phonicsText = document.createElement("input");
    phonicsText.classList.add("phonics");
    phonicsText.type = "text";
    pickerDiv.appendChild(phonicsText);

    parent.appendChild(pickerDiv);
    segmentObject.onload = () => {
        segmentObject.contentDocument.addEventListener("contextmenu", (event) => {event.preventDefault()});
        segmentObject.contentDocument.querySelectorAll(".segment").forEach((segment) => {
            segment.style.opacity = 0;
            let invertSegment = (mouseEvent) => {
                if ((mouseEvent.buttons & 1) == 1) {
                    segment.style.opacity = 100;
                }
                if ((mouseEvent.buttons & 2) == 2) {
                    segment.style.opacity = 0;
                }
                phonicsText.value = getSegmentPhonemes(segmentObject);
            }
            segment.addEventListener("mouseover", invertSegment);
        });
    };
}

function getSegmentPhonemes(segmentObject) {
    let codeToPhoneme = {
        1: "e\u{26A}",
        4: "a\u{26A}",
        5: "\u{259}",
        40: "w",
        197: "\u{E6}",
        274: "j",
        530: "l",
        536: "ch",
        538: "y",
        560: "p",
        562: "r",
        568: "t",
        816: "f",
        818: "s",
        1042: "b",
        1050: "v",
        1074: "k",
        1280: "m",
        1288: "n",
        1298: "d",
        1338: "zh",
        1554: "h",
        1562: "z",
        1584: "g",
        1810: "th",
        1848: "sh",
        1850: "ng",
        2048: "oy",
        2240: "\u{28A}",
        2245: "oo",
        4096: "a\u{28A}",
        4288: "air",
        4289: "ear",
        4293: "or",
        6144: "\u{26A}",
        6149: "ar",
        6336: "\u{25B}",
        6337: "ee",
        6340: "er",
        6341: "o\u{28A}",
    };
    let segmentClassList = [
        "tlt",
        "tmt",
        "trt",
        "tlb",
        "tmb",
        "trb",
        "tl",
        "bl",
        "blt",
        "bm",
        "brt",
        "blb",
        "brb"
    ];
    const vowelFilter = 0b1100011000101;
    let segments = segmentObject.contentDocument.querySelectorAll(".segment");
    let code = 0;
    for (let i = 0; i < segmentClassList.length; i++) {
        segments.forEach((segment) => {
            if (segment.id == segmentClassList[i] && segment.style.opacity == 100) {
                code += 1 << i;
            }
        });
    }
    let reverse = false;
    segments.forEach((segment) => {
        console.log(segment.id);
        if (segment.id == "reverse" && segment.style.opacity == 100) {
            reverse = true;
        }
    });
    console.log(code);
    let consonantPhoneme = codeToPhoneme[code & ~vowelFilter] || "";
    let vowelPhoneme = codeToPhoneme[code & vowelFilter] || "";
    return reverse ? vowelPhoneme + consonantPhoneme : consonantPhoneme + vowelPhoneme;
}