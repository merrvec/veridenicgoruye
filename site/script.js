const variableNames = {
  study_hours_per_day: "Çalışma Süresi",
  social_media_hours: "Sosyal Medya Süresi",
  netflix_hours: "Netflix Süresi",
  attendance_percentage: "Devam Oranı",
  sleep_hours: "Uyku Süresi",
  exercise_frequency: "Egzersiz Sıklığı",
  mental_health_rating: "Ruh Sağlığı",
  previous_gpa: "Önceki Not Ortalaması",
  stress_level: "Stres Düzeyi",
  screen_time: "Ekran Süresi",
  motivation_level: "Motivasyon",
  exam_anxiety_score: "Sınav Kaygısı",
  time_management_score: "Zaman Yönetimi",
  exam_score: "Sınav Puanı"
};

function grafikRenginiAl(tur){
  if(tur === "histogram") return "#E75480";
  if(tur === "bar") return "#0B55AD";
  if(tur === "box") return "#8B5CF6";
  return "#00A6A6";
}

function generateComparison(){
  const x = document.getElementById("xSelect").value;
  const y = document.getElementById("ySelect").value;
  const chartType = document.getElementById("chartSelect").value;

  const xData = studentData.map(d => d[x]);
  const yData = studentData.map(d => d[y]);

  let trace;

  if(chartType === "scatter"){
    trace = {
      x:xData,
      y:yData,
      mode:"markers",
      type:"scatter",
      marker:{ size:9, opacity:0.78, color:grafikRenginiAl(chartType) }
    };
  }

  if(chartType === "bar"){
    trace = {
      x:xData,
      y:yData,
      type:"bar",
      marker:{ color:grafikRenginiAl(chartType) }
    };
  }

  if(chartType === "histogram"){
    trace = {
      x:xData,
      type:"histogram",
      marker:{ color:grafikRenginiAl(chartType) }
    };
  }

  if(chartType === "box"){
    trace = {
      y:yData,
      type:"box",
      boxpoints:"outliers",
      marker:{ color:grafikRenginiAl(chartType) }
    };
  }

  const layout = {
    title: variableNames[x] + " ve " + variableNames[y] + " Karşılaştırması",
    paper_bgcolor:"#FFF7FA",
    plot_bgcolor:"#FFF7FA",
    font:{ color:"#4A2438" },
    xaxis:{ title:variableNames[x], gridcolor:"rgba(74,36,56,0.15)" },
    yaxis:{ title:variableNames[y], gridcolor:"rgba(74,36,56,0.15)" }
  };

  Plotly.newPlot("comparisonChart", [trace], layout, {responsive:true});

  document.getElementById("comparisonResult").innerHTML = `
    <h3>${variableNames[x]} ve ${variableNames[y]}</h3>
    <p>Seçilen değişkenler grafik üzerinde karşılaştırılmıştır. Bu panel veri setindeki ilişkileri dinamik olarak incelemeyi sağlar.</p>
  `;
}

function dataCevapla(){
  const input = document.getElementById("kullaniciSorusu");
  const soru = input.value.toLowerCase();
  const alan = document.getElementById("chatAlan");

  if(input.value.trim() === "") return;

  let cevap = "Bu konu hakkında daha detaylı analiz yapılabilir. Veri seti, grafik türleri veya yapay zeka hakkında daha spesifik bir soru sorabilirsiniz.";

  if(soru.includes("heatmap") || soru.includes("ısı haritası")){
    cevap = "Heatmap, değişkenler arasındaki korelasyonları renk yoğunluğu ile gösterir.";
  } else if(soru.includes("scatter") || soru.includes("serpilme")){
    cevap = "Serpilme grafiği iki sayısal değişken arasındaki ilişkiyi görselleştirir.";
  } else if(soru.includes("histogram")){
    cevap = "Histogram, verilerin hangi aralıklarda yoğunlaştığını gösterir.";
  } else if(soru.includes("boxplot") || soru.includes("kutu")){
    cevap = "Kutu grafiği, medyanı, çeyrekleri ve aykırı değerleri gösterir.";
  } else if(soru.includes("bar") || soru.includes("sütun")){
    cevap = "Sütun grafiği, kategoriler arasındaki değer farklarını karşılaştırır.";
  } else if(soru.includes("korelasyon")){
    cevap = "Korelasyon, iki değişken arasındaki ilişkinin yönünü ve gücünü gösterir.";
  } else if(soru.includes("veri görselleştirme")){
    cevap = "Veri görselleştirme, ham veriyi grafikler aracılığıyla anlaşılır hale getirme sürecidir.";
  } else if(soru.includes("veri")){
    cevap = "Veri, gözlem, ölçüm veya araştırma sonucunda elde edilen ham bilgilerdir.";
  } else if(soru.includes("yapay zeka")){
    cevap = "Yapay zeka, bilgisayar sistemlerinin öğrenme ve karar verme süreçlerini gerçekleştirmesini amaçlayan teknoloji alanıdır.";
  }

  alan.innerHTML += `<div class="chat-mesaj kullanici">${input.value}</div>`;

  const typingId = "typing-" + Date.now();

  alan.innerHTML += `
    <div class="chat-mesaj bot" id="${typingId}">
      Data düşünüyor...
    </div>
  `;

  setTimeout(() => {
    document.getElementById(typingId).innerHTML = cevap;
  }, 800);

  input.value = "";
  alan.scrollIntoView({ behavior:"smooth", block:"end" });
}

function hazirSoru(soru){
  document.getElementById("kullaniciSorusu").value = soru;
  dataCevapla();
}

function temaDegistir(){
  document.body.classList.toggle("karanlik");
  const buton = document.getElementById("temaButonu");

  if(buton){
    buton.textContent = document.body.classList.contains("karanlik") ? "☀️" : "🌙";
  }
}

document.addEventListener("DOMContentLoaded", function(){
  const input = document.getElementById("kullaniciSorusu");

  if(input){
    input.addEventListener("keydown", function(event){
      if(event.key === "Enter"){
        dataCevapla();
      }
    });
  }

  const grafikSecici = document.getElementById("chartSelect");

  if(grafikSecici){
    grafikSecici.addEventListener("change", function(){
      generateComparison();
    });
  }
});

function dataButonRenginiDegistir(tur){
  const data = document.getElementById("dataFloatButton");
  if(!data) return;

  data.classList.remove("data-scatter", "data-histogram", "data-bar", "data-box");

  if(tur === "histogram"){
    data.classList.add("data-histogram");
  } else if(tur === "bar"){
    data.classList.add("data-bar");
  } else if(tur === "box"){
    data.classList.add("data-box");
  } else {
    data.classList.add("data-scatter");
  }
}

document.addEventListener("DOMContentLoaded", function(){
  const grafikSecici = document.getElementById("chartSelect");

  if(grafikSecici){
    dataButonRenginiDegistir(grafikSecici.value);

    grafikSecici.addEventListener("change", function(){
      dataButonRenginiDegistir(this.value);
    });
  }
});

function dataBalonRenginiDegistir(tur){
  const data = document.getElementById("dataFloatButton");
  if(!data) return;

  data.classList.remove("data-scatter", "data-histogram", "data-bar", "data-box");

  if(tur === "histogram") data.classList.add("data-histogram");
  else if(tur === "bar") data.classList.add("data-bar");
  else if(tur === "box") data.classList.add("data-box");
  else data.classList.add("data-scatter");
}

document.addEventListener("DOMContentLoaded", function(){
  const secici = document.getElementById("chartSelect");

  if(secici){
    dataBalonRenginiDegistir(secici.value);

    secici.addEventListener("change", function(){
      dataBalonRenginiDegistir(this.value);
    });
  }
});
