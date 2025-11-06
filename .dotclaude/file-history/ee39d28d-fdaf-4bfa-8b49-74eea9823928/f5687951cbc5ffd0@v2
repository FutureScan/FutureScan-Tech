import Image from 'next/image';

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Image
              src="/logo.png"
              alt="FutureScan"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">FutureScan</span>
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Cryptocurrency Intelligence Platform for Swing Traders
            </p>
            <p className="text-sm text-gray-500">
              Version 1.0 | {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-10">
            {/* Abstract */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">Abstract</h2>
              <p className="text-gray-300 leading-relaxed">
                FutureScan is a comprehensive cryptocurrency intelligence platform designed
                specifically for swing traders seeking 2-4 week holding periods. By
                aggregating data from 9+ public sources and applying advanced sentiment
                analysis and technical indicators, FutureScan provides actionable trading
                signals without requiring users to analyze charts. Our platform combines
                real-time market data, news sentiment, whale wallet tracking, and AI-powered
                recommendations to help traders make informed decisions in the volatile
                cryptocurrency market.
              </p>
            </section>

            {/* Table of Contents */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">Table of Contents</h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Introduction</li>
                <li>Market Problem</li>
                <li>Solution Overview</li>
                <li>Technical Architecture</li>
                <li>Data Sources & Methodology</li>
                <li>Core Features</li>
                <li>Signal Generation Algorithm</li>
                <li>Security & Privacy</li>
                <li>Roadmap</li>
                <li>Disclaimer</li>
              </ol>
            </section>

            {/* 1. Introduction */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The cryptocurrency market operates 24/7/365, generating an overwhelming
                amount of data that even experienced traders struggle to process. Swing
                traders—those seeking to capitalize on medium-term price movements over 2-4
                weeks—face particular challenges in filtering signal from noise.
              </p>
              <p className="text-gray-300 leading-relaxed">
                FutureScan addresses this challenge by aggregating multi-source data,
                analyzing sentiment patterns, tracking institutional movements (whale
                activity), and generating AI-powered trading recommendations tailored for
                swing trading strategies.
              </p>
            </section>

            {/* 2. Market Problem */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">2. Market Problem</h2>

              <h3 className="text-xl font-semibold mb-3">2.1 Information Overload</h3>
              <p className="text-gray-300 mb-4">
                Cryptocurrency markets generate thousands of news articles, social media
                posts, and price movements daily. Traders spend hours sifting through
                information, often missing critical signals.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.2 Technical Analysis Barriers</h3>
              <p className="text-gray-300 mb-4">
                Traditional technical analysis requires deep expertise in chart patterns,
                indicators (RSI, MACD, Bollinger Bands), and volume analysis. Many retail
                traders lack this specialized knowledge.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.3 Whale Manipulation</h3>
              <p className="text-gray-300 mb-4">
                Large holders ("whales") can significantly impact prices through
                accumulation or distribution. Retail traders typically detect these movements
                too late.
              </p>

              <h3 className="text-xl font-semibold mb-3">2.4 Sentiment Misinterpretation</h3>
              <p className="text-gray-300">
                Market sentiment drives short-to-medium term price action, but manually
                analyzing sentiment across multiple sources is impractical for individual
                traders.
              </p>
            </section>

            {/* 3. Solution Overview */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">
                3. Solution Overview
              </h2>
              <p className="text-gray-300 mb-4">
                FutureScan provides a unified intelligence platform that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  <strong>Aggregates</strong> real-time data from 9+ cryptocurrency APIs and
                  data sources
                </li>
                <li>
                  <strong>Analyzes</strong> sentiment across news articles using NLP
                  techniques
                </li>
                <li>
                  <strong>Tracks</strong> whale wallet movements to detect accumulation and
                  distribution patterns
                </li>
                <li>
                  <strong>Generates</strong> AI-powered trading signals with entry, target,
                  and stop-loss levels
                </li>
                <li>
                  <strong>Presents</strong> information in a clean, actionable format
                  requiring no chart analysis
                </li>
              </ul>
            </section>

            {/* 4. Technical Architecture */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">
                4. Technical Architecture
              </h2>

              <h3 className="text-xl font-semibold mb-3">4.1 Frontend Stack</h3>
              <div className="bg-[#0a0a0a] p-4 rounded-lg mb-4 font-mono text-sm">
                <p className="text-green-400">• Next.js 16.0.1 (React 19.2.0)</p>
                <p className="text-green-400">• TypeScript 5.x</p>
                <p className="text-green-400">• Tailwind CSS 4.x</p>
                <p className="text-green-400">• Zustand (State Management)</p>
                <p className="text-green-400">• Recharts (Data Visualization)</p>
              </div>

              <h3 className="text-xl font-semibold mb-3">4.2 Data Layer</h3>
              <p className="text-gray-300 mb-3">
                FutureScan implements intelligent caching and rate limiting to ensure
                reliable performance:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>
                  <strong>Rate Limiting:</strong> Respects API limits (10-20 calls/minute per
                  source)
                </li>
                <li>
                  <strong>Caching:</strong> 1-5 minute cache for frequently accessed data
                </li>
                <li>
                  <strong>Retry Logic:</strong> Automatic retry with exponential backoff
                </li>
                <li>
                  <strong>Error Handling:</strong> Graceful degradation when APIs are
                  unavailable
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">4.3 Client-Side Storage</h3>
              <p className="text-gray-300">
                User preferences and watchlists are stored locally using browser localStorage,
                ensuring privacy and offline capability. No personal data is transmitted to
                external servers.
              </p>
            </section>

            {/* 5. Data Sources */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">
                5. Data Sources & Methodology
              </h2>

              <h3 className="text-xl font-semibold mb-3">5.1 Market Data</h3>
              <div className="bg-[#0a0a0a] p-4 rounded-lg mb-4">
                <p className="text-gray-300">
                  <strong className="text-[#ff6b35]">CoinGecko API</strong>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Provides real-time prices, market caps, trading volumes, and 7-day
                  sparklines for 10,000+ cryptocurrencies. Updated every 60 seconds.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3">5.2 News & Sentiment</h3>
              <div className="bg-[#0a0a0a] p-4 rounded-lg mb-4">
                <p className="text-gray-300">
                  <strong className="text-[#ff6b35]">CryptoCompare News API</strong>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Aggregates crypto news from 100+ sources. Our proprietary sentiment analysis
                  engine processes article titles and bodies using keyword-based NLP to
                  classify sentiment as Bullish, Bearish, or Neutral.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3">5.3 Market Sentiment Index</h3>
              <div className="bg-[#0a0a0a] p-4 rounded-lg mb-4">
                <p className="text-gray-300">
                  <strong className="text-[#ff6b35]">Alternative.me Fear & Greed Index</strong>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Measures overall market sentiment on a 0-100 scale by analyzing volatility,
                  market momentum, social media, surveys, and Bitcoin dominance. Updated
                  daily.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3">5.4 Sentiment Analysis Methodology</h3>
              <p className="text-gray-300 mb-3">
                Our sentiment classification uses a keyword-scoring system:
              </p>
              <div className="bg-[#0a0a0a] p-4 rounded-lg font-mono text-sm">
                <p className="text-green-400 mb-2">
                  Bullish Keywords: surge, rally, soar, gain, rise, bull, growth, adoption
                </p>
                <p className="text-red-400 mb-2">
                  Bearish Keywords: crash, plunge, drop, fall, decline, bear, loss, regulation
                </p>
                <p className="text-yellow-400">
                  Neutral: No dominant sentiment detected
                </p>
              </div>
            </section>

            {/* 6. Core Features */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">6. Core Features</h2>

              <h3 className="text-xl font-semibold mb-3">6.1 Dashboard</h3>
              <p className="text-gray-300 mb-4">
                Centralized overview displaying market sentiment, personal watchlist with
                real-time prices, latest news, and quick access to all features. Includes a
                BTC/USD calculator for quick conversions.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 News Feed</h3>
              <p className="text-gray-300 mb-4">
                Real-time cryptocurrency news with AI-powered sentiment classification.
                Filterable by Bullish, Bearish, or Neutral sentiment. Each article displays
                source, timestamp, and related cryptocurrencies.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.3 Insider Trading Signals</h3>
              <p className="text-gray-300 mb-4">
                Detects whale wallet movements indicating accumulation (bullish) or
                distribution (bearish) patterns. Each signal includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>Confidence score (0-100%)</li>
                <li>Transaction volume and value</li>
                <li>Wallet address (anonymized)</li>
                <li>Price at signal generation</li>
                <li>Timestamp and interpretation</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">6.4 AI Trading Signals</h3>
              <p className="text-gray-300 mb-4">
                Generates Buy/Hold/Sell recommendations optimized for 2-4 week swing trades.
                Each signal provides:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-1 mb-4">
                <li>
                  <strong>Entry Price:</strong> Recommended entry point
                </li>
                <li>
                  <strong>Target Price:</strong> Profit-taking level (typically 15% gain)
                </li>
                <li>
                  <strong>Stop Loss:</strong> Risk management level (typically 8% loss)
                </li>
                <li>
                  <strong>Confidence Score:</strong> Signal strength (50-90%)
                </li>
                <li>
                  <strong>Technical Indicators:</strong> RSI, MACD, volume trends, sentiment
                  score
                </li>
                <li>
                  <strong>Reasoning:</strong> Human-readable explanation of the signal
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">6.5 Watchlist Management</h3>
              <p className="text-gray-300">
                Customizable cryptocurrency tracking with real-time price updates, 24-hour
                change percentages, and quick add/remove functionality. Search across 10,000+
                cryptocurrencies.
              </p>
            </section>

            {/* 7. Signal Generation */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">
                7. Signal Generation Algorithm
              </h2>

              <h3 className="text-xl font-semibold mb-3">7.1 Multi-Factor Analysis</h3>
              <p className="text-gray-300 mb-4">
                Our signal generation combines five key factors:
              </p>

              <div className="space-y-4">
                <div className="bg-[#0a0a0a] p-4 rounded-lg">
                  <p className="font-semibold text-[#ff6b35] mb-2">
                    1. Relative Strength Index (RSI)
                  </p>
                  <p className="text-sm text-gray-400">
                    Normalized from 7-day price change. RSI &lt; 30 = oversold (buy signal),
                    RSI &gt; 70 = overbought (sell signal).
                  </p>
                </div>

                <div className="bg-[#0a0a0a] p-4 rounded-lg">
                  <p className="font-semibold text-[#ff6b35] mb-2">
                    2. Moving Average Convergence Divergence (MACD)
                  </p>
                  <p className="text-sm text-gray-400">
                    Derived from RSI trend. Bullish crossover when RSI &gt; 50, bearish when
                    RSI &lt; 50.
                  </p>
                </div>

                <div className="bg-[#0a0a0a] p-4 rounded-lg">
                  <p className="font-semibold text-[#ff6b35] mb-2">3. Volume Analysis</p>
                  <p className="text-sm text-gray-400">
                    Compares 24h volume to market cap. Volume &gt; 10% of market cap indicates
                    strong interest and potential momentum.
                  </p>
                </div>

                <div className="bg-[#0a0a0a] p-4 rounded-lg">
                  <p className="font-semibold text-[#ff6b35] mb-2">4. Sentiment Score</p>
                  <p className="text-sm text-gray-400">
                    Aggregated from news sentiment and Fear & Greed Index. Higher sentiment
                    correlates with bullish signals.
                  </p>
                </div>

                <div className="bg-[#0a0a0a] p-4 rounded-lg">
                  <p className="font-semibold text-[#ff6b35] mb-2">5. Price Action</p>
                  <p className="text-sm text-gray-400">
                    24-hour and 7-day price changes. Extreme movements (±5%) trigger signal
                    generation.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Confidence Calculation</h3>
              <p className="text-gray-300 mb-3">
                Signal confidence is calculated using a weighted formula:
              </p>
              <div className="bg-[#0a0a0a] p-4 rounded-lg font-mono text-sm">
                <p className="text-green-400">
                  Confidence = Base(50%) + RSI_factor(20%) + Volume_factor(15%) +
                </p>
                <p className="text-green-400 ml-12">
                  Sentiment_factor(10%) + Price_momentum(5%)
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                7.3 Risk Management Parameters
              </h3>
              <p className="text-gray-300 mb-3">
                All signals include risk management levels:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>
                  <strong>Target Price:</strong> 15% above entry for buy signals (1.5:1
                  risk-reward)
                </li>
                <li>
                  <strong>Stop Loss:</strong> 8% below entry to limit downside risk
                </li>
                <li>
                  <strong>Time Horizon:</strong> 2-4 weeks to allow swing patterns to develop
                </li>
              </ul>
            </section>

            {/* 8. Security & Privacy */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">
                8. Security & Privacy
              </h2>

              <h3 className="text-xl font-semibold mb-3">8.1 Data Privacy</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>All user data stored locally in browser localStorage</li>
                <li>No personal information collected or transmitted</li>
                <li>No user accounts or authentication required</li>
                <li>No wallet connections or private key access</li>
                <li>Anonymized API requests without user identification</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">8.2 Security Measures</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>HTTPS encryption for all data transmission</li>
                <li>Rate limiting prevents API abuse</li>
                <li>Input validation protects against XSS attacks</li>
                <li>Regular dependency updates for vulnerability patches</li>
                <li>No server-side data storage reduces attack surface</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">8.3 API Security</h3>
              <p className="text-gray-300">
                All external API calls implement retry logic, timeout protection, and error
                handling. No API keys are exposed client-side; all calls use public endpoints
                requiring no authentication.
              </p>
            </section>

            {/* 9. Roadmap */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">9. Roadmap</h2>

              <div className="space-y-4">
                <div className="border-l-4 border-[#ff6b35] pl-4">
                  <h3 className="font-semibold text-lg">Q1 2025 - Foundation</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mt-2">
                    <li>✅ Core platform launch</li>
                    <li>✅ Real-time data integration</li>
                    <li>✅ Sentiment analysis</li>
                    <li>✅ Basic signal generation</li>
                  </ul>
                </div>

                <div className="border-l-4 border-gray-600 pl-4">
                  <h3 className="font-semibold text-lg">Q2 2025 - Enhancement</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mt-2">
                    <li>Advanced charting capabilities</li>
                    <li>Portfolio tracking</li>
                    <li>Price alerts and notifications</li>
                    <li>Historical signal performance tracking</li>
                    <li>Mobile responsive optimizations</li>
                  </ul>
                </div>

                <div className="border-l-4 border-gray-600 pl-4">
                  <h3 className="font-semibold text-lg">Q3 2025 - Intelligence</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mt-2">
                    <li>Machine learning model training</li>
                    <li>Real blockchain data for whale tracking</li>
                    <li>Social media sentiment integration (Twitter/X, Reddit)</li>
                    <li>Multi-timeframe signal generation</li>
                    <li>Backtesting capability</li>
                  </ul>
                </div>

                <div className="border-l-4 border-gray-600 pl-4">
                  <h3 className="font-semibold text-lg">Q4 2025 - Community</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mt-2">
                    <li>User accounts with cloud sync</li>
                    <li>Signal sharing and discussion forums</li>
                    <li>Educational resources and tutorials</li>
                    <li>API access for developers</li>
                    <li>Premium features (advanced signals, early access)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 10. Disclaimer */}
            <section>
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">10. Disclaimer</h2>
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-6">
                <p className="font-semibold text-red-400 mb-4 text-lg">
                  IMPORTANT: NOT FINANCIAL ADVICE
                </p>
                <p className="text-gray-300 mb-3">
                  FutureScan is an educational and informational platform. Nothing presented
                  on this platform constitutes financial, investment, trading, legal, or tax
                  advice. All signals, recommendations, and analyses are for educational
                  purposes only.
                </p>
                <p className="text-gray-300 mb-3">
                  Cryptocurrency trading carries substantial risk of loss. Past performance
                  does not guarantee future results. Users should:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Conduct independent research before making investment decisions</li>
                  <li>Consult with qualified financial advisors</li>
                  <li>Never invest more than they can afford to lose</li>
                  <li>Understand that signal accuracy cannot be guaranteed</li>
                  <li>Be aware of the high volatility and risk in cryptocurrency markets</li>
                </ul>
                <p className="text-gray-300 mt-3 font-semibold">
                  By using FutureScan, you acknowledge and accept these risks and agree that
                  the platform and its creators bear no responsibility for trading losses.
                </p>
              </div>
            </section>

            {/* Conclusion */}
            <section className="border-t border-gray-800 pt-8">
              <h2 className="text-3xl font-bold mb-4 text-[#ff6b35]">Conclusion</h2>
              <p className="text-gray-300 leading-relaxed">
                FutureScan represents a new paradigm in cryptocurrency intelligence,
                democratizing access to institutional-grade data analysis for retail swing
                traders. By eliminating the need for complex chart analysis and aggregating
                multi-source intelligence into actionable signals, we empower traders to make
                informed decisions efficiently.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Our commitment to privacy, security, and data accuracy ensures that FutureScan
                remains a trusted tool for cryptocurrency intelligence. As we continue to
                enhance our algorithms and expand our data sources, we invite traders to join
                us in shaping the future of crypto trading intelligence.
              </p>
            </section>

            {/* Footer */}
            <section className="text-center pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-500 mb-2">
                FutureScan | Cryptocurrency Intelligence Platform
              </p>
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} FutureScan. All rights reserved.
              </p>
              <a
                href="mailto:Future_Scan@tech-center.com"
                className="text-sm text-[#ff6b35] hover:underline"
              >
                Future_Scan@tech-center.com
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
