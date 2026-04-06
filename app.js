const requestBody = {
    englishDialect: "indifferent",
    autoReplace: true,
    getCorrectionDetails: false,
    interfaceLanguage: "fr",
    locale: "",
    language: "fra",
    text: "tiri",
    originalText: "",
    spellingFeedbackOptions: {
        insertFeedback: false,
        userLoggedOn: false,
    },
    origin: "interactive",
    isHtml: false,
    IsUserPremium: false,
};
const requestHeaders = {
    Host: "orthographe.reverso.net",
    "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:141.0) Gecko/20100101 Firefox/141.0",
    Accept: "text/json",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Content-Type": "application/*+json",
    Origin: "https://www.reverso.net",
    DNT: "1",
    "Sec-GPC": "1",
    Referer: "https://www.reverso.net/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    Priority: "u=0",
};

const getFixedText = async (text) => {
    requestBody.text = text;

    const rawResponse = await fetch(
        "https://orthographe.reverso.net/api/v1/Spelling/",
        {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: requestHeaders,
        }
    );

    const response = await rawResponse.json();
    return response.text;
};

const btn = document.getElementById("submit");
btn.addEventListener("click", async (e) => {
    const input = document.getElementById("input").value;
    const segmentedInput = []
    let accumulator = ""
    for (let i = 0; i < input.length; i ++){
        accumulator += input[i]
        if (i % 250 == 0 && i != 0){
            while (input[i] != " " && i != input.length){
                accumulator += input[i]
                i ++
            }
            segmentedInput.push(accumulator)
            accumulator = " "
        } 
    }
    segmentedInput.push(accumulator)
    let output = "";
    for (let i = 0; i < segmentedInput.length; i ++){
        const result = await getFixedText(segmentedInput[i])
        if (i != 0) output += " " + segmentedInput[i][1] + result.substring(2,result.length)
        else output += result
        document.getElementById("output").innerText = output;
        document.getElementById("output").innerHTML += `<br><strong>Loading ${Math.round( ((i+1) * 250)/input.length*100)}%...</strong>`;
        if (i != segmentedInput.length -1 )await new Promise((r) => setTimeout(r, 5000));
    }
    document.getElementById("output").innerText = output
});

document.getElementById("copy").addEventListener('click',()=>{
    var aux = document.createElement("input");
    aux.setAttribute("value", document.getElementById("output").innerText);
    document.body.appendChild(aux);

  aux.select();
  aux.setSelectionRange(0, 99999); // For mobile devices

  navigator.clipboard.writeText(aux.value);
document.body.removeChild(aux);
})

