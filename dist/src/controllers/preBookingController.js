const preBookingController = {
    changeDate: (flightInfo) => {
        let options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        options['timeZone'] = 'Asia/Bangkok';
        let date = flightInfo[0].flightID["date"].toLocaleDateString('en-GB', options);
    }
};
//# sourceMappingURL=preBookingController.js.map