import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import plotly.express as px

df = pd.read_csv("data/student.csv")

df["gender"] = df["gender"].replace({
    "Male": "Erkek",
    "Female": "Kadın",
    "Other": "Diğer"
})
print(df[["study_hours_per_day", "exam_score", "gender"]].head())
print(df[["study_hours_per_day", "exam_score", "gender"]].isna().sum())
print(df[["study_hours_per_day", "exam_score", "gender"]].dtypes)

# 1. HISTOGRAM
fig1 = px.histogram(
    df,
    x="study_hours_per_day",
    nbins=20,
    title="Günlük Çalışma Süresi Dağılımı",
    labels={"study_hours_per_day": "Günlük Çalışma Süresi (Saat)"}
)
fig1.update_yaxes(title="Öğrenci Sayısı")
fig1.update_layout(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(color="black")
)
fig1.write_html("site/graphs/histogram.html")


# ------------------------------------------------
# 2. SCATTER PLOT
# ------------------------------------------------

scatter_df = df[["study_hours_per_day", "exam_score", "gender"]].copy()

scatter_df["study_hours_per_day"] = pd.to_numeric(
    scatter_df["study_hours_per_day"], errors="coerce"
)
scatter_df["exam_score"] = pd.to_numeric(
    scatter_df["exam_score"], errors="coerce"
)

scatter_df = scatter_df.dropna(
    subset=["study_hours_per_day", "exam_score", "gender"]
)

print("Scatter veri sayısı:", len(scatter_df))

fig2 = go.Figure()

renkler = {
    "Erkek": "#6A3D9A",
    "Kadın": "#E75480",
    "Diğer": "#00A6A6"
}

for cinsiyet, renk in renkler.items():
    alt_veri = scatter_df[scatter_df["gender"] == cinsiyet]

    fig2.add_trace(
        go.Scatter(
            x=alt_veri["study_hours_per_day"],
            y=alt_veri["exam_score"],
            mode="markers",
            name=cinsiyet,
            marker=dict(
                color=renk,
                size=8,
                opacity=0.75,
                line=dict(width=0)
            ),
            hovertemplate=
            "<b>Cinsiyet:</b> " + cinsiyet + "<br>" +
            "<b>Çalışma Süresi:</b> %{x}<br>" +
            "<b>Sınav Puanı:</b> %{y}<extra></extra>"
        )
    )

fig2.update_layout(
    title="Çalışma Süresi ve Sınav Başarısı",
    paper_bgcolor="#F8EDEF",
    plot_bgcolor="#F8EDEF",
    font=dict(color="#4A2438", size=16),
    title_font=dict(color="#4A2438", size=24),
    legend_title_text="Cinsiyet",
    xaxis_title="Çalışma Süresi",
    yaxis_title="Sınav Puanı"
)

fig2.update_xaxes(
    showgrid=True,
    gridcolor="rgba(74,36,56,0.18)",
    zeroline=False
)

fig2.update_yaxes(
    showgrid=True,
    gridcolor="rgba(74,36,56,0.18)",
    zeroline=False
)

fig2.write_html("site/graphs/scatter.html")

# 3. HEATMAP
numeric_df = df.select_dtypes(include="number")

if "student_id" in numeric_df.columns:
    numeric_df = numeric_df.drop(columns=["student_id"])

corr = numeric_df.corr()

turkish_labels = {
    "age": "Yaş",
    "study_hours_per_day": "Günlük Çalışma Süresi",
    "social_media_hours": "Sosyal Medya Süresi",
    "netflix_hours": "Netflix Süresi",
    "attendance_percentage": "Devam Oranı",
    "sleep_hours": "Uyku Süresi",
    "exercise_frequency": "Egzersiz Sıklığı",
    "mental_health_rating": "Ruh Sağlığı Puanı",
    "previous_gpa": "Önceki Not Ortalaması",
    "semester": "Dönem",
    "stress_level": "Stres Düzeyi",
    "social_activity": "Sosyal Aktivite",
    "screen_time": "Ekran Süresi",
    "parental_support_level": "Aile Destek Düzeyi",
    "motivation_level": "Motivasyon Düzeyi",
    "exam_anxiety_score": "Sınav Kaygısı",
    "time_management_score": "Zaman Yönetimi",
    "exam_score": "Sınav Puanı"
}

corr = corr.rename(columns=turkish_labels, index=turkish_labels)

fig3 = px.imshow(
    corr,
    text_auto=".2f",
    aspect="auto",
    color_continuous_scale="Purples",
    title="Öğrenci Performans Değişkenleri Arasındaki Korelasyon Analizi",
    labels={
        "x": "Değişkenler",
        "y": "Değişkenler",
        "color": "Korelasyon"
    }
)
fig3.update_layout(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(color="black", size=15),
    xaxis_title="Değişkenler",
    yaxis_title="Değişkenler"
)
fig3.write_html("site/graphs/heatmap.html")

# 4. BOXPLOT
fig4 = px.box(
    df,
    y="exam_score",
    color="gender",
    title="Sınav Puanı Dağılımı",
    labels={
        "exam_score": "Sınav Puanı",
        "gender": "Cinsiyet"
    }
)
fig4.update_layout(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(color="black")
)
fig4.write_html("site/graphs/boxplot.html")

# 5. BAR CHART
avg_scores = df.groupby("gender")["exam_score"].mean().reset_index()

fig5 = px.bar(
    avg_scores,
    x="gender",
    y="exam_score",
    title="Cinsiyete Göre Ortalama Sınav Puanı",
    labels={
        "gender": "Cinsiyet",
        "exam_score": "Ortalama Puan"
    }
)
fig5.update_layout(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(color="black")
)
fig5.write_html("site/graphs/bar_chart.html")

print("TÜM GRAFİKLER OLUŞTU")