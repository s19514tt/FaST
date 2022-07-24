## Wrong GP2 file

```

html:
    <div>
        <p>${message}</p>
        <p id='show1'>${message+message2}</p>
        <div :if='show2'>
            ${message+message2} <!-- Text node(s) depending on variables must not have sibling nodes -->
            <p :if='show3'>
                ${message+message2}
            </p>
        </div>
    </div>
script:
    const message = "Hello world"
    const message2 = "Hello world"
    const show1 = true
    const show2 = true
    const show3 = true



```
