'use client'

export default function ReportExportButton({ assessment, dimensionScores, overallAvg }: any) {
  const handleExportText = () => {
    let content = `====================================================\n`
    content += `         AIMM MATURITY ASSESSMENT REPORT            \n`
    content += `====================================================\n\n`
    content += `Organization: ${assessment.organization.name}\n`
    content += `Contact Person: ${assessment.user.name} (${assessment.user.email})\n`
    content += `Assessment Date: ${new Date(assessment.createdAt).toLocaleDateString()}\n`
    content += `Maturity Framework: ${assessment.maturityModel.name} (v${assessment.maturityModel.version})\n\n`
    
    content += `----------------------------------------------------\n`
    content += `GLOBAL MATURITY INDEX: ${overallAvg} / 5.0\n`
    content += `----------------------------------------------------\n\n`

    content += `DIMENSIONAL BREAKDOWN & IDENTIFIED INTERVENTIONS:\n\n`

    dimensionScores.forEach((stat: any) => {
      content += `[${stat.dim.name.toUpperCase()}] - Score: ${stat.avg} / 5.0\n`
      content += `Current Stance: Level ${stat.currentLevel}\n`
      content += `Diagnosis: ${stat.descriptor?.name || 'Unmapped'}\n`
      content += `Intervention & Criteria:\n${stat.descriptor?.description || 'No maturity definition provided.'}\n\n`
    })

    content += `====================================================\n`
    content += `Generated electronically by the AIMM Consultant Platform\n`
    content += `====================================================\n`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AIMM_Report_${assessment.organization.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button 
      onClick={handleExportText}
      className="flex items-center justify-center gap-3 bg-black hover:bg-neutral-800 text-white px-6 py-3 font-black uppercase tracking-widest text-xs transition-colors"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export .TXT Report
    </button>
  )
}
