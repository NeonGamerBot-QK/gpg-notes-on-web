(async () => {
    const parentElement = document.getElementById("createkey")
    if (!parentElement) return;
    let currentKeys = {
        pub: localStorage.getItem("pubKey") || "",
        priv: localStorage.getItem("privKey") || ""
    }
    const keyInfo = currentKeys.pub ? await openpgp.readKey({ armoredKey: currentKeys.pub }) : null;
    const privKeyInfo = currentKeys.priv ? await openpgp.readPrivateKey({ armoredKey: currentKeys.priv }) : null;
    console.log(keyInfo, privKeyInfo);
    // 
    const createNewKey = document.createElement("button");
    createNewKey.innerText = "Create New Keypair";
    createNewKey.className = "btn btn-primary";
    createNewKey.onclick = async () => {
        const urlSearchParams = new URLSearchParams();
        const name = prompt("Enter your name for the keypair (optional)") || "";
        urlSearchParams.append("name", name);
        const email = prompt("Enter your email for the keypair (optional)") || "";
        urlSearchParams.append("email", email);

        fetch('/api/genkey?' + urlSearchParams.toString()).then(r => r.json()).then(async (data) => {
            currentKeys.priv = data.privateKey
            currentKeys.pub = data.publicKey
            localStorage.setItem("privKey", currentKeys.priv)
            localStorage.setItem("pubKey", currentKeys.pub)
            const keyinf = await openpgp.readKey({ armoredKey: currentKeys.pub })
            alert("created and saved key " + keyinf.users[0].userID.userID)
        })
    }
    const keyStatus = document.createElement("div");
    if (keyInfo && privKeyInfo) {
        keyStatus.innerText = `Current Key: ${keyInfo.users[0].userID.userID}`;
        keyStatus.className = "alert alert-success";
    } else {
        keyStatus.innerText = "No Keypair Found";
        keyStatus.className = "alert alert-warning";
    }
    parentElement.appendChild(keyStatus);
    parentElement.appendChild(document.createElement("br"));
    parentElement.appendChild(createNewKey);
    parentElement.className = "p-2 border rounded border-color-secondary";
})();
