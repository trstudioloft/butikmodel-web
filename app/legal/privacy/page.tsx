export default function PrivacyPage() {
  return (
    <div className="prose prose-lg max-w-none text-gray-600">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Gizlilik Politikası</h1>
      <p className="text-sm text-gray-400 mb-10">Son Güncelleme: 16 Ocak 2026</p>

      <p className="lead text-xl text-gray-800 font-medium">
        ButikModel.com ("Biz", "Şirket") olarak gizliliğinize büyük önem veriyoruz. Bu politika, platformumuzu kullanırken verilerinizin nasıl işlendiğini açıklar.
      </p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Toplanan Veriler</h3>
      <p>Hizmetlerimizi kullanırken şu verileri toplarız:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Hesap Bilgileri:</strong> E-posta adresi, ad ve şifre (şifrelenmiş olarak saklanır).</li>
        <li><strong>Görsel Veriler:</strong> Sisteme yüklediğiniz kıyafet, manken veya ürün fotoğrafları.</li>
        <li><strong>Kullanım Verileri:</strong> IP adresi, tarayıcı tipi ve işlem kayıtları (Loglar).</li>
      </ul>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Görsel İşleme ve Güvenlik</h3>
      <p>
        Yüklediğiniz fotoğraflar sadece talep ettiğiniz yapay zeka işlemini gerçekleştirmek (manken giydirme, arkaplan silme vb.) amacıyla sunucularımızda işlenir.
      </p>
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 my-4 text-blue-800 text-sm font-bold">
        🛡 Yüklenen görseller, işlem tamamlandıktan 24 saat sonra sunucularımızdan otomatik olarak silinir. Asla üçüncü taraflara satılmaz, reklam amaçlı kullanılmaz veya izinsiz paylaşılmaz.
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Çerezler (Cookies)</h3>
      <p>Oturumunuzu açık tutmak, tercihlerinizi hatırlamak ve site performansını analiz etmek için zorunlu ve analitik çerezleri kullanırız.</p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Veri Paylaşımı</h3>
      <p>Verileriniz, yasal zorunluluklar dışında (mahkeme kararı vb.) hiçbir kurum veya kişiyle paylaşılmaz. Ödeme işlemleri şifreli olarak Iyzico/Stripe altyapısı üzerinden gerçekleşir, kredi kartı bilgileriniz sunucularımızda tutulmaz.</p>

      <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. İletişim</h3>
      <p>Gizlilikle ilgili sorularınız için <a href="/contact" className="text-blue-600 underline">İletişim</a> sayfasından veya <strong>privacy@butikmodel.com</strong> adresinden bize ulaşabilirsiniz.</p>
    </div>
  );
}