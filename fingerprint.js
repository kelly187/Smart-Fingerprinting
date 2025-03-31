async function get_fingerprint() {
    const fingerprint = [];

    // Canvas Fingerprinting
    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not supported");
        
        const txt = "BrowserLeaks,com <canvas> 1.0";
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);

        let code = canvas.toDataURL();
        code = code.replace("data:image/png;base64,", "");
        const cd = code.length - 1;
        code = code[999] || "x"; // Fallback if code is too short
        code = window.btoa(code);
        document.getElementById('canvass_id').innerHTML = "Canvas ID: " + code;
        fingerprint.push({ key: "canvas_id", value: code });
    } catch (e) {
        fingerprint.push({ key: "canvas_id", value: "blocked" });
        fingerprint.push({ key: "possible_blocking", value: true });
    }

    // Basic Browser Info
    fingerprint.push({ key: "user_agent", value: navigator.userAgent });
    fingerprint.push({ key: "language", value: navigator.language });
    fingerprint.push({ key: "pixel_ratio", value: window.devicePixelRatio });
    fingerprint.push({ key: "hardware_concurrency", value: navigator.hardwareConcurrency || "unknown" });
    fingerprint.push({ key: "resolution", value: [screen.width, screen.height] });
    fingerprint.push({ key: "available_resolution", value: [screen.availHeight, screen.availWidth] });
    fingerprint.push({ key: "timezone_offset", value: new Date().getTimezoneOffset() });

    // Storage Checks
    fingerprint.push({ key: "session_storage", value: !window.sessionStorage });
    fingerprint.push({ key: "local_storage", value: !window.localStorage });
    fingerprint.push({ key: "indexed_db", value: !window.indexedDB });
    fingerprint.push({ key: "open_database", value: !window.openDatabase });

    // Platform and Hardware
    fingerprint.push({ key: "navigator_platform", value: navigator.platform });
    fingerprint.push({ key: "navigator_buildID", value: 'buildID' in navigator });
    fingerprint.push({ key: "mem", value: navigator.deviceMemory || "unknown" });
    fingerprint.push({ key: "java_enabled", value: navigator.javaEnabled() });

    // Font Family
    const ff = window.getComputedStyle(document.body, null).getPropertyValue("font-family").replace(/"/g, "");
    fingerprint.push({ key: "font_family", value: ff });

    // GPU Info
    if (navigator.gpu) {
        fingerprint.push({ key: "gpu_size", value: navigator.gpu.wgslLanguageFeatures?.size || "unknown" });
    }

    // Deprecated but still useful
    if (navigator.oscpu) {
        fingerprint.push({ key: "navigator_oscpu", value: navigator.oscpu });
    }
    if (navigator.doNotTrack !== null) {
        fingerprint.push({ key: "do_not_track", value: navigator.doNotTrack });
    }

    // Touch Support
    fingerprint.push({ key: "touch_support", value: navigator.maxTouchPoints });

    // Plugins
    for (let i = 0; i < navigator.plugins.length; i++) {
        fingerprint.push({ key: "navigator_plugin_" + i, value: navigator.plugins[i].name });
    }
    fingerprint.push({ key: "cookie_enabled", value: navigator.cookieEnabled });

    // WebGL Fingerprinting
    try {
        const gl = document.createElement("canvas").getContext("webgl");
        if (gl) {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
            fingerprint.push({
                key: "webgl_vendor",
                value: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "unknown"
            });
            fingerprint.push({
                key: "webgl_renderer",
                value: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown"
            });
        }
    } catch (e) {
        fingerprint.push({ key: "webgl_support", value: "blocked" });
    }

    // Audio Fingerprinting
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        fingerprint.push({ key: "audio_sample_rate", value: audioCtx.sampleRate });
        audioCtx.close();
    } catch (e) {
        fingerprint.push({ key: "audio_support", value: "blocked" });
    }

    // Generate Short Fingerprint
    let short_fingerprint = "";
    for (let j = 0; j < fingerprint.length; j++) {
        short_fingerprint += fingerprint[j].value.toString().toLowerCase().substring(0, 1);
    }
    short_fingerprint += fingerprint.length;
    short_fingerprint += navigator.plugins.length;

    // Replace hash with raw fingerprint
    const hashedCode = fingerprint;

    // Display Results
    document.getElementById('short').innerHTML = "Fingerprint ID: " + short_fingerprint;
    document.getElementById('platf').innerHTML = "Device Platform: " + navigator.platform;
    document.getElementById('plat').innerHTML = "User Agent: " + navigator.userAgent;

    // Detailed Output in Table
    let longOutput = "<table>";
    fingerprint.forEach(item => {
        longOutput += `<tr><td>${item.key}</td><td>${item.value}</td></tr>`;
    });
    longOutput += "</table>";
    document.getElementById('long').innerHTML = longOutput;

    // Log for Debugging
    console.log("Full Fingerprint:", fingerprint);
    console.log("Short Fingerprint:", short_fingerprint);
    console.log("Hashed Fingerprint (raw):", hashedCode);

    // Optional: Send to Server (uncomment and configure URL)
    /*
    fetch("https://your-server.com/store-fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: fingerprint, short_id: short_fingerprint })
    }).catch(e => console.error("Server error:", e));
    */
}